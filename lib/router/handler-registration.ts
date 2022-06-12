import type { Handler } from './handler';

export function registerHandler<
  T extends {
    new (): Handler;
  }
>(Clazz: T) {
  const instance = new Clazz();
  return instance.internalHandle();
}
