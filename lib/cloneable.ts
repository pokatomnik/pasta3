export interface Cloneable<T> {
  clone(modifier: (clone: T) => T): T;
}
