import { Downloader } from './download';
import { Clipboard } from './copy';
import { Disposable } from '../../../lib/disposable';

export class Export implements Disposable {
  private disposed = false;

  public get isDisposed() {
    return this.disposed;
  }

  public readonly downloader = new Downloader();

  public readonly clipboard: Clipboard;

  public constructor(params: {
    clipboardInitialization: {
      handleTextarea: (textarea: HTMLTextAreaElement) => Disposable;
    };
  }) {
    this.clipboard = new Clipboard(params.clipboardInitialization);
  }

  public dispose() {
    this.disposed = true;
    this.clipboard.dispose();
  }
}
