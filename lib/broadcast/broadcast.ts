import { SSRBroadcastChannel } from './ssr-broadcast-channel';
import { MessagePacker } from './message-packer';
import { BroadcastChannel, OnMessageHandler } from 'broadcast-channel';
import * as Environment from './environment-detection';
import type { Disposable } from '../disposable';

export class Broadcast implements Disposable {
  private readonly messagePacker = new MessagePacker();

  private readonly broadcastChannel: BroadcastChannel<string>;

  private _isDisposed = false;

  constructor(name: string) {
    this.broadcastChannel = Environment.select({
      browser: () => new BroadcastChannel(name),
      server: () => SSRBroadcastChannel,
    })();
  }

  private subscribe(subscriber: (message: string) => void) {
    const listener: OnMessageHandler<string> = (data) => {
      this.messagePacker.handleMessage(data, (unpackedMessage) => {
        subscriber(unpackedMessage);
      });
    };
    this.broadcastChannel.addEventListener('message', listener);
    return () => {
      this.broadcastChannel.removeEventListener('message', listener);
    };
  }

  private dispatch(message: string) {
    this.messagePacker.packMessage(message, (packedMessage) => {
      this.broadcastChannel.postMessage(packedMessage);
    });
  }

  private runIfNotDisposed<R>(fn: () => R) {
    if (this.isDisposed) {
      console.warn('Trying to use disposed channel');
    }
    return fn();
  }

  private dispatcher = {
    dispatch: (message: string) => {
      return this.runIfNotDisposed(() => {
        return this.dispatch(message);
      });
    },
  };

  private subscriber = {
    subscribe: (subscriber: (message: string) => void) => {
      return this.runIfNotDisposed(() => {
        return this.subscribe(subscriber);
      });
    },
  };

  public getDispatcher(): Readonly<
    InstanceType<typeof Broadcast>['dispatcher']
  > {
    return this.dispatcher;
  }

  public getSubscriber(): Readonly<
    InstanceType<typeof Broadcast>['subscriber']
  > {
    return this.subscriber;
  }

  public get isDisposed() {
    return this._isDisposed;
  }

  public dispose() {
    this._isDisposed = true;
    this.broadcastChannel.close();
  }
}
