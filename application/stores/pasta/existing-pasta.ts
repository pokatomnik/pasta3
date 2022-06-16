import { makeAutoObservable } from 'mobx';
import type { Pasta } from '../../../domain/pasta';
import type { HttpClient } from '../../http-client/http-client';

export class ExistingPasta implements Pasta {
  constructor(
    private readonly source: Pasta,
    private readonly params: {
      removable: boolean;
      httpClient: HttpClient;
      removeFromList: () => void;
      restore: () => void;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get _id() {
    return this.source._id;
  }

  public get email() {
    return this.source.email;
  }

  public get name() {
    return this.source.name;
  }

  public get content() {
    return this.source.content;
  }

  public get dateCreated() {
    return this.source.dateCreated;
  }

  public get encrypted() {
    return Boolean(this.source.encrypted);
  }

  public async tryRemove() {
    if (!this.params.removable) {
      return;
    }
    try {
      await this.params.httpClient.pastaClient.removePastaById(this._id);
      this.params.removeFromList();
    } catch (e) {
      this.params.restore();
    }
  }
}
