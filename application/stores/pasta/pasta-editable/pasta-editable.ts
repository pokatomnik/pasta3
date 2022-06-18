import { makeAutoObservable, runInAction } from 'mobx';
import debounce from 'lodash/debounce';
import type { Pasta } from '../../../../domain/pasta';
import { Cloneable } from '../../../../lib/cloneable';
import { PastaEncryption } from '../../encryption';
import { Cleanup, Export } from '../../../services/export';
import { useDispatcher, useSubscriber } from '../../../services/broadcast';
import type { Serializer } from '../../../../lib/serialization';

type PastaData = Omit<Pasta, '_id' | 'email' | 'dateCreated'>;

export class PastaEditable implements PastaData, Cloneable<PastaEditable> {
  private serializer: Serializer<PastaData> = JSON;

  private exportService = new Export();

  public constructor(
    private readonly params: {
      dispatcher: ReturnType<typeof useDispatcher>;
      subscriber: ReturnType<typeof useSubscriber>;
      onSave: (pasta: PastaEditable) => void;
      addCleanup: (cleanup: Cleanup) => void;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    params.addCleanup({
      cleanup: params.subscriber.subscribe((pastaJSON) => {
        const parsedPasta = this.getParsedPasta(pastaJSON);
        if (parsedPasta !== null) {
          runInAction(() => {
            this._name = parsedPasta.name;
            this._content = parsedPasta.content;
            this._encrypted = Boolean(parsedPasta.encrypted);
          });
        }
      }),
    });
  }

  private broadcastChanges = debounce(() => {
    const pastaData: PastaData = {
      name: this._name,
      content: this._content,
      encrypted: this._encrypted,
    };
    const serialized = this.serializer.stringify(pastaData);
    this.params.dispatcher.dispatch(serialized);
  }, 2000);

  private getParsedPasta(pastaJSON: string): PastaData | null {
    try {
      return this.serializer.parse(pastaJSON);
    } catch (e) {
      return null;
    }
  }

  public clone(
    modifier: (clone: PastaEditable) => PastaEditable
  ): PastaEditable {
    const pasta = new PastaEditable(this.params);
    return modifier(pasta);
  }

  private _name = '';
  public get name() {
    return this._name;
  }
  public setName(newName: string) {
    this._name = newName;
    this.broadcastChanges();
  }

  private _content = '';
  public get content() {
    return this._content;
  }
  public setContent(newContent: string) {
    this._content = newContent;
    this.broadcastChanges();
  }

  private _encrypted = false;
  public get encrypted() {
    return this._encrypted;
  }
  public setEncrypted(encrypted: boolean) {
    this._encrypted = encrypted;
    this.broadcastChanges();
  }

  public save(encryption: PastaEncryption) {
    encryption
      .encrypt(this._content)
      .then((encryptedContent) => {
        this.params.onSave(
          this.clone((pasta) => {
            pasta._name = this._name;
            pasta._content = encryptedContent;
            pasta._encrypted = this._encrypted;
            return pasta;
          })
        );
      })
      .catch(() => {
        console.error('Save cancelled');
      });
  }

  public get canBeSaved() {
    return this._name !== '' && this._content !== '';
  }

  public download() {
    this.params.addCleanup(
      this.exportService.downloader.download(this._content, `${this._name}.txt`)
    );
  }
}
