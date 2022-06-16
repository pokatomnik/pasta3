import * as React from 'react';
import { type SymmetricEncryption, AES, DES } from '../../../lib/encryption';

export class Encrypion {
  public readonly symmetricAlgorithms: Array<SymmetricEncryption> = [
    new AES(),
    new DES(),
  ];

  private static readonly Context = React.createContext<Encrypion>(
    new Encrypion()
  );

  public static use() {
    return React.useContext(Encrypion.Context);
  }
}
