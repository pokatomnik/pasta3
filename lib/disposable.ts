export interface Disposable {
  isDisposed: boolean;
  dispose: () => void;
}
