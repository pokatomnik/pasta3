import type { Disposable } from './disposable';

export class DisposablesCollection implements Disposable {
  private disposed = false;

  private readonly disposables = new Array<Disposable>();

  public addDisposable(disposable: Disposable) {
    this.disposables.push(disposable);
  }

  public get isDisposed() {
    return this.disposed;
  }

  public dispose() {
    while (this.disposables.length > 0) {
      this.disposables.shift()?.dispose();
    }
  }
}
