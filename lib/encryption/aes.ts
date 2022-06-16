import CryptoJS from 'crypto-js';
import { SymmetricEncryption } from './symmetric';

export class AES implements SymmetricEncryption {
  public readonly name = 'AES';

  public async encrypt(data: string, pass: string): Promise<string> {
    return CryptoJS.AES.encrypt(data, pass).toString();
  }

  public async decrypt(encrypted: string, pass: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encrypted, pass);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
