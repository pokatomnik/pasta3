import { makeAutoObservable, runInAction } from 'mobx';
import debounce from 'lodash/debounce';
import { Cloneable } from '../../../../lib/cloneable';
import { PastaEncryption } from '../../encryption';
import { Cleanup, Export } from '../../../services/export';
import { useDispatcher, useSubscriber } from '../../../services/broadcast';
import type { Serializer } from '../../../../lib/serialization';
import type { PastaData } from './pasta-data';
import { LocalEdits } from './local-edits';
import { CrossplatformStorage } from './crossplaform-storage';

export class PastaEditable implements PastaData, Cloneable<PastaEditable> {
  private readonly broadcastSerializer: Serializer<PastaData> = JSON;

  private readonly persistentStorageSerializer: Serializer<PastaData> = JSON;

  private readonly localEdits = new LocalEdits({
    key: 'pasta:new',
    persistentStorage: CrossplatformStorage.getInstance(),
    serializer: this.persistentStorageSerializer,
  });

  private exportService = new Export();

  private _name = '';

  private _content = '';

  private _encrypted = false;

  private get json(): PastaData {
    return {
      name: this._name,
      content: this._content,
      encrypted: this._encrypted,
    };
  }

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
    const savedPasta = this.localEdits.get();
    if (savedPasta) {
      Promise.resolve(savedPasta).then((savedPasta) => {
        runInAction(() => {
          this._name = savedPasta.name;
          this._content = savedPasta.content;
          this._encrypted = Boolean(savedPasta.encrypted);
        });
      });
    }
  }

  private broadcastChanges = debounce(() => {
    const serialized = this.broadcastSerializer.stringify(this.json);
    this.params.dispatcher.dispatch(serialized);
  }, 2000);

  private saveToPersistentStorage = debounce(() => {
    this.localEdits.set(this.json);
  }, 2000);

  private getParsedPasta(pastaJSON: string): PastaData | null {
    try {
      return this.broadcastSerializer.parse(pastaJSON);
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

  public get name() {
    return this._name;
  }
  public setName(newName: string) {
    this._name = newName;
    this.broadcastChanges();
    this.saveToPersistentStorage();
  }

  public get content() {
    return this._content;
  }
  public setContent(newContent: string) {
    this._content = newContent;
    this.broadcastChanges();
    this.saveToPersistentStorage();
  }
  public get encrypted() {
    return this._encrypted;
  }
  public setEncrypted(encrypted: boolean) {
    this._encrypted = encrypted;
    this.broadcastChanges();
    this.saveToPersistentStorage();
  }

  public reset() {
    this._name = '';
    this._content = '';
    this._encrypted = false;
    this.broadcastChanges();
    this.saveToPersistentStorage();
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
        console.warn('Save cancelled');
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
