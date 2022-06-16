import { SymmetricEncryption } from '../../../lib/encryption';

export class NoEncrypion implements SymmetricEncryption {
  public readonly name = 'Plain';

  public async encrypt(data: string): Promise<string> {
    return data;
  }

  public async decrypt(encrypted: string): Promise<string> {
    return encrypted;
  }
}
