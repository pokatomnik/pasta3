import * as React from 'react';
import { SymmetricEncryption } from '../../../lib/encryption';
import { AES } from '../../services/encryption/symmetric';

export class Encrypion {
  public readonly symmetric: Map<string, SymmetricEncryption> = new Map([
    ['AES', new AES()],
  ]);

  public readonly symmetricAlgorithms = Array.from(this.symmetric.keys());

  private static readonly Context = React.createContext<Encrypion>(
    new Encrypion()
  );

  public static use() {
    return React.useContext(Encrypion.Context);
  }
}
