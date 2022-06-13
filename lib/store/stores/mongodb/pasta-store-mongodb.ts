import { Pasta } from '../../../domain/pasta';
import type { IPastaStore } from '../../pasta-store';
import { PastaModel } from './models/pasta';
import { MongoDBConnection } from './connection-singleton';

export class MongoDBPastaStore implements IPastaStore {
  public async createPasta(
    email: string,
    name: string,
    content: string
  ): Promise<Pasta> {
    const result = await MongoDBConnection.requireConnected(async () => {
      const dateCreated = Date.now();
      const pasta = new PastaModel({ email, name, content, dateCreated });
      const saveResult = await pasta.save();
      return saveResult?.toObject() ?? null;
    });
    return result;
  }

  public async getPasta(email: string, id: string): Promise<Pasta> {
    const result = await MongoDBConnection.requireConnected(async () => {
      const result = await PastaModel.findOne({ email, _id: id }).exec();
      return result?.toObject() ?? null;
    });
    return result;
  }

  public async getPastas(
    email: string,
    from: number,
    limit: number
  ): Promise<Array<Pasta>> {
    const result = await MongoDBConnection.requireConnected(async () => {
      const result = await PastaModel.find({ email })
        .sort({ dateCreated: 1 })
        .skip(from)
        .limit(limit)
        .exec();
      return result;
    });
    return result;
  }

  public deletePasta(email: string, id: string): Promise<void> {
    console.log(email, id);
    throw new Error('Method not implemented.');
  }
}
