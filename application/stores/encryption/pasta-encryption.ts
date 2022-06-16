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
    return this.params.symmetricEncrypion.decrypt(data, pass);
  }

  public get symmetricEncrypion() {
    return this.params.symmetricEncrypion;
  }
}
