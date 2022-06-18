import { makeAutoObservable } from 'mobx';
import type { Pasta } from '../../../domain/pasta';
import { Cloneable } from '../../../lib/cloneable';
import { PastaEncryption } from '../encryption';
import { Cleanup, Export } from '../../services/export';

export class PastaEditable
  implements
    Omit<Pasta, '_id' | 'email' | 'dateCreated'>,
    Cloneable<PastaEditable>
{
  private exportService = new Export();

  public constructor(
    private readonly params: {
      onSave: (pasta: PastaEditable) => void;
      addCleanup: (cleanup: Cleanup) => void;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
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
  }

  private _content = '';
  public get content() {
    return this._content;
  }
  public setContent(newContent: string) {
    this._content = newContent;
  }

  private _encrypted = false;
  public get encrypted() {
    return this._encrypted;
  }
  public setEncrypted(encrypted: boolean) {
    this._encrypted = encrypted;
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
