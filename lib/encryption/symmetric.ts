export interface SymmetricEncryption {
  encrypt(data: string, pass: string): Promise<string>;
  decrypt(encrypted: string, pass: string): Promise<string>;
}
