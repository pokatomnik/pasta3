export interface SymmetricEncryption {
  name: string;
  encrypt(data: string, pass: string): Promise<string>;
  decrypt(encrypted: string, pass: string): Promise<string>;
}
