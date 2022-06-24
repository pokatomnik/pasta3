import noop from 'lodash/noop';
import Axios from 'axios';

export interface ICancellable {
  cancel: () => void;
}

export class CancellableInvocation<T> implements ICancellable {
  private readonly abortController = new AbortController();

  public constructor(
    private readonly invokeFn: (signal: AbortSignal) => Promise<T>
  ) {}

  public invoke() {
    return this.invokeFn(this.abortController.signal).catch((err) => {
      if (Axios.isCancel(err)) {
        return new Promise<never>(noop);
      }
      throw err;
    });
  }

  public cancel() {
    this.abortController.abort();
  }
}
