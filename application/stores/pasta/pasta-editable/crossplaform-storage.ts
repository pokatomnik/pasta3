import { PersistentStorage } from '../../../../lib/persistent-storage';

export class CrossplatformStorage {
  private static storageMock: PersistentStorage = {
    getItem(): string | null {
      return null;
    },
    setItem(): void {
      // Do nothing
    },
  };

  public static getInstance(): PersistentStorage {
    try {
      if (window.localStorage) {
        return window.localStorage;
      } else {
        return CrossplatformStorage.storageMock;
      }
    } catch (e) {
      return CrossplatformStorage.storageMock;
    }
  }
}
