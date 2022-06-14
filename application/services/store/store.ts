import type { IStore, IPastaStore } from '../../../lib/store';
import { PastaStore } from './pasta-store';

export class Store implements IStore {
  public readonly pastaStore: IPastaStore = new PastaStore();
}
