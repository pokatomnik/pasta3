import Joi from 'joi';
import { PersistentStorage } from '../../../../lib/persistent-storage';
import { Serializer } from '../../../../lib/serialization';
import { ValueContainer } from '../../../../lib/value-container';
import type { PastaData } from './pasta-data';

export class LocalEdits implements ValueContainer<PastaData> {
  private readonly validator = Joi.object<PastaData>({
    name: Joi.string().allow(''),
    content: Joi.string().allow(''),
    encrypted: Joi.boolean().required(),
  }).required();

  public constructor(
    private readonly params: {
      key: string;
      persistentStorage: PersistentStorage;
      serializer: Serializer<PastaData>;
    }
  ) {}

  public get(): PastaData | null {
    try {
      const valueRaw = this.params.persistentStorage.getItem(this.params.key);
      if (valueRaw === null) {
        return null;
      }
      const value = this.params.serializer.parse(valueRaw);
      const validationResult = this.validator.validate(value);
      if (validationResult.error) {
        console.warn(
          'Persistent storage has incorrect data, falling back to null values'
        );
        return null;
      }
      return validationResult.value;
    } catch (e) {
      console.warn(
        'Getting a value from the persistent storage encountered error:'
      );
      console.warn(e);
      return null;
    }
  }

  public set(value: PastaData): void {
    const validationResult = this.validator.validate(value);
    if (validationResult.error) {
      return console.warn(
        'Trying to set incorrect data to a persistent storage. No-op.'
      );
    }
    const serializedValue = this.params.serializer.stringify(value);
    this.params.persistentStorage.setItem(this.params.key, serializedValue);
  }
}
