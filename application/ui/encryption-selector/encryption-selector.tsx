import * as React from 'react';
import { Select, FormControl, MenuItem } from '@mui/material';
import { Encrypion, PastaEncryption } from '../../stores/encryption';

export function EncryptionSelector(props: {
  requirePasss: () => Promise<string>;
  onAlgorithmChange: (algorithm: PastaEncryption) => void;
}) {
  const algorithms = Encrypion.use();

  const menuItemValues = React.useMemo<Array<PastaEncryption>>(() => {
    return algorithms.symmetricAlgorithms.map((alg) => {
      return new PastaEncryption({
        symmetricEncrypion: alg,
        requirePass: props.requirePasss,
      });
    });
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

  React.useEffect(() => {
    const algorithmNameIndex = names.indexOf(selectedName);
    const algorithm = menuItemValues[algorithmNameIndex];
    if (algorithm) {
      props.onAlgorithmChange(algorithm);
    }
  }, [props.onAlgorithmChange, selectedName, menuItemValues, names]);

  return (
    <FormControl variant="standard" sx={{ minWidth: 80 }}>
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

// EncryptionSelector.defaultAlgorithm = new PastaEncryption({
//   symmetricEncrypion: new AES(),
//   requirePass: () => Promise.resolve(''),
// });
