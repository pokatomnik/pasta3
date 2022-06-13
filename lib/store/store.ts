import type { IPastaStore } from './pasta-store';
import { MongoDBPastaStore } from './stores/mongodb';

export class Store {
  public readonly pastaStore: IPastaStore = new MongoDBPastaStore();
}
