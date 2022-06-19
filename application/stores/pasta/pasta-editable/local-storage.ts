import { PersistentStorage } from '../../../../lib/persistent-storage';

export class SSRFriendlyLocalStorage {
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
        return SSRFriendlyLocalStorage.storageMock;
      }
    } catch (e) {
      return SSRFriendlyLocalStorage.storageMock;
    }
  }
}
