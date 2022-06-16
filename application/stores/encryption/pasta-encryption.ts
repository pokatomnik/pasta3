import { SymmetricEncryption } from '../../../lib/encryption';

export class PastaEncryption {
  public constructor(
    private readonly params: {
      symmetricEncrypion: SymmetricEncryption;
      requirePass: () => Promise<string>;
    }
  ) {}

  public get name() {
    return this.params.symmetricEncrypion.name;
  }

  public async encrypt(data: string): Promise<string> {
    const pass = await this.params.requirePass();
    return this.params.symmetricEncrypion.encrypt(data, pass);
  }

  public async decrypt(data: string): Promise<string> {
    const pass = await this.params.requirePass();
    const result = await this.params.symmetricEncrypion.decrypt(data, pass);

    if (!result) {
      throw new Error('Failed to decrypt');
    }

    return result;
  }

  public get symmetricEncrypion() {
    return this.params.symmetricEncrypion;
  }
}
