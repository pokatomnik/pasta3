import CryptoJS from 'crypto-js';
import { SymmetricEncryption } from './symmetric';

export class DES implements SymmetricEncryption {
  public readonly name = 'DES';

  public async encrypt(data: string, pass: string): Promise<string> {
    return CryptoJS.DES.encrypt(data, pass).toString();
  }

  public async decrypt(encrypted: string, pass: string): Promise<string> {
    const bytes = CryptoJS.DES.decrypt(encrypted, pass);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
