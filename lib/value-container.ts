export interface ValueContainer<T extends object> {
  get(): T | null;
  set(value: T): void;
}
