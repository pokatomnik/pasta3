import noop from 'lodash/noop';
import { Pasta } from '../../../../domain/pasta';
import type { IPastaStore } from '../../../../lib/store';
import { PastaModel } from './models/pasta';
import { MongoDBConnection } from './connection-singleton';

export class PastaStore implements IPastaStore {
  public readonly identifierLength = 24;

  public async createPasta(
    email: string,
    name: string,
    content: string
  ): Promise<Pasta> {
    return await MongoDBConnection.requireConnected(async () => {
      const dateCreated = Date.now();
      const pasta = new PastaModel({ email, name, content, dateCreated });
      const saveResult = await pasta.save();
      return saveResult?.toObject() ?? null;
    });
  }

  public async getPasta(email: string, id: string): Promise<Pasta> {
    return await MongoDBConnection.requireConnected(async () => {
      const result = await PastaModel.findOne({ email, _id: id }).exec();
      return result?.toObject() ?? null;
    });
  }

  public async getPastas(
    email: string,
    from: number,
    limit: number
  ): Promise<Array<Pasta>> {
    if (limit === 0) {
      return [];
    }
    return await MongoDBConnection.requireConnected(async () => {
      return await PastaModel.find({ email })
        .sort({ dateCreated: 1 })
        .skip(from)
        .limit(limit)
        .exec();
    });
  }

  public async deletePasta(email: string, id: string): Promise<void> {
    return await MongoDBConnection.requireConnected(async () => {
      return PastaModel.deleteOne({
        email,
        _id: id,
      })
        .exec()
        .then(noop);
    });
  }
}
