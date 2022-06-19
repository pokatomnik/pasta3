export interface Serializer<T> {
  parse(serialized: string): T;
  stringify(val: T): string;
}

export interface Serializable<T> {
  stringify(): T;
}
