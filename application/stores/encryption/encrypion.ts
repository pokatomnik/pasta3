import * as React from 'react';
import { type SymmetricEncryption, AES } from '../../../lib/encryption';

export class Encrypion {
  public readonly symmetricAlgorithms: Array<SymmetricEncryption> = [new AES()];

  private static readonly Context = React.createContext<Encrypion>(
    new Encrypion()
  );

  public static use() {
    return React.useContext(Encrypion.Context);
  }
}
