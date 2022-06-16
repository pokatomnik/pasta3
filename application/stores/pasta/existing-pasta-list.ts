import { makeAutoObservable, observable, runInAction } from 'mobx';
import { Session } from 'next-auth';
import type { HttpClient } from '../../http-client/http-client';
import { ExistingPasta } from './existing-pasta';
import { PastaEditable } from './pasta-editable';

export class ExistingPastaList {
  private readonly map: Map<string, ExistingPasta> = observable.map();

  public get list() {
    return Array.from(this.map.values()).sort((a, b) => {
      return b.dateCreated - a.dateCreated;
    });
  }

  public constructor(
    private readonly params: {
      session: Session | null;
      httpClient: HttpClient;
      onNewSaveError: (e: unknown) => void;
      onReloadError: (e: unknown) => void;
      onSaveNewSuccess: () => void;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public async saveNew(pasta: PastaEditable) {
    if (!this.params.session) {
      return console.warn('User unauthorized');
    }
    const email = this.params.session.user?.email;
    if (!email) {
      return this.params.onNewSaveError(new Error('User email is missing'));
    }
    const randomId = Math.random().toString(36).slice(2);
    const pastaMock = {
      _id: randomId,
      email,
      name: pasta.name,
      content: pasta.content,
      dateCreated: Date.now(),
    };
    const newExistingPasta = new ExistingPasta(pastaMock, {
      removable: false,
      httpClient: this.params.httpClient,
      removeFromList: () =>
        runInAction(() => {
          this.map.delete(randomId);
        }),
      restore: () =>
        runInAction(() => {
          this.map.set(randomId, newExistingPasta);
        }),
    });
    runInAction(() => {
      this.map.set(randomId, newExistingPasta);
    });

    try {
      const realPasta = await this.params.httpClient.pastaClient.createPasta(
        pasta.name,
        pasta.content,
        pasta.encrypted
      );
      const realExistingPasta = new ExistingPasta(realPasta, {
        removable: true,
        httpClient: this.params.httpClient,
        removeFromList: () =>
          runInAction(() => {
            this.map.delete(realPasta._id);
          }),
        restore: () =>
          runInAction(() => {
            this.map.set(realPasta._id, realExistingPasta);
          }),
      });
      runInAction(() => {
        this.map.set(realPasta._id, realExistingPasta);
      });
      this.params.onSaveNewSuccess();
    } catch (e) {
      this.params.onNewSaveError(e);
    } finally {
      runInAction(() => {
        this.map.delete(randomId);
      });
    }
  }

  public async reload() {
    if (!this.params.session) {
      return this.params.onReloadError('User unauthorized');
    }
    try {
      const pasta = await this.params.httpClient.pastaClient.getAllPastas();
      runInAction(() => {
        this.map.clear();
        for (const currentPasta of pasta) {
          const existingPasta = new ExistingPasta(currentPasta, {
            removable: true,
            httpClient: this.params.httpClient,
            removeFromList: () =>
              runInAction(() => {
                this.map.delete(currentPasta._id);
              }),
            restore: () =>
              runInAction(() => {
                this.map.set(currentPasta._id, existingPasta);
              }),
          });
          runInAction(() => {
            this.map.set(existingPasta._id, existingPasta);
          });
        }
      });
    } catch (e) {
      this.params.onReloadError(e);
    }
  }
}
