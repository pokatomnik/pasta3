import * as React from 'react';
import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { Encrypion } from '../../stores/encryption';
import { SymmetricEncryption } from '../../../lib/encryption';
import { NoEncrypion } from './no-encrypion';
import { PastaEncryption } from './pasta-encryption';

export function EncryptionSelector(props: {
  requirePasss: () => Promise<string>;
  onAlgorithmChange: (algorithm: SymmetricEncryption) => void;
}) {
  const algorithms = Encrypion.use();

  const menuItemValues = React.useMemo<Array<PastaEncryption>>(() => {
    const pastaNoEncryption = new PastaEncryption({
      symmetricEncrypion: EncryptionSelector.defaultAlgorithm,
      requirePass: () => Promise.resolve(''),
    });
    const pastaWithEncryption = algorithms.symmetricAlgorithms.map((alg) => {
      return new PastaEncryption({
        symmetricEncrypion: alg,
        requirePass: props.requirePasss,
      });
    });
    return [pastaNoEncryption].concat(pastaWithEncryption);
  }, [algorithms.symmetricAlgorithms, props.requirePasss]);

  const names = React.useMemo(() => {
    return menuItemValues.map((item) => {
      return item.name;
    });
  }, [menuItemValues]);

  const [selectedName, setSelectedName] = React.useState(() => {
    const firstAlgorithmName = names[0];
    if (!firstAlgorithmName) {
      throw new Error('No encryption algorithms');
    }
    return firstAlgorithmName;
  });

  return (
    <FormControl variant="standard" sx={{ minWidth: 120 }}>
      <Select
        value={selectedName}
        onChange={(event) => {
          setSelectedName(event.target.value);
        }}
        label="Encryption"
      >
        {names.map((name) => {
          return (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

EncryptionSelector.defaultAlgorithm = new NoEncrypion();
