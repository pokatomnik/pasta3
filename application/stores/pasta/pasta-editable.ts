import { makeAutoObservable } from 'mobx';
import type { Pasta } from '../../../domain/pasta';

export class PastaEditable
  implements Omit<Pasta, '_id' | 'email' | 'dateCreated'>
{
  public constructor(
    private readonly params: { onSave: (pasta: PastaEditable) => void }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
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

  public save() {
    this.params.onSave(this);
  }

  public get canBeSaved() {
    return this._name !== '' && this._content !== '';
  }
}
