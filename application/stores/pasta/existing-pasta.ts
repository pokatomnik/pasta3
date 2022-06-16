import { makeAutoObservable, runInAction } from 'mobx';
import type { Pasta } from '../../../domain/pasta';
import type { HttpClient } from '../../http-client/http-client';
import { PastaEncryption } from '../encryption';
import { CountdownTimer } from './countdown-timer';

export class ExistingPasta implements Pasta {
  private _decryptedContent: string | null = null;

  private _countdownTimer = new CountdownTimer({
    callbackEvery: 0,
    time: 0,
  });
  public get countdownTimer() {
    return this._countdownTimer;
  }

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
    return this._decryptedContent ?? this.source.content;
  }

  public get dateCreated() {
    return this.source.dateCreated;
  }

  public get encrypted() {
    return Boolean(this.source.encrypted);
  }

  public get isDecrypted() {
    return this._decryptedContent !== null;
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

  public decryptForMS(
    encryption: PastaEncryption,
    displayDecryptedDataFor: number,
    onError: (e: unknown) => void = () => {}
  ) {
    encryption
      .decrypt(this.source.content)
      .then((decryptedContent) => {
        runInAction(() => {
          this._decryptedContent = decryptedContent;
          this._countdownTimer = new CountdownTimer({
            time: displayDecryptedDataFor,
            callbackEvery: displayDecryptedDataFor / 100,
          }).start();
          setTimeout(() => {
            runInAction(() => {
              this._decryptedContent = null;
            });
          }, displayDecryptedDataFor);
        });
      })
      .catch(onError);
  }
}
