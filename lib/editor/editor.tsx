import * as React from 'react';
import { TextField } from '@mui/material';
import { getSelectedWord } from './word-extractor';

export function Editor(props: {
  minRows?: number;
  onChange: (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value: string;
  placeholder?: string;
  workClickedFeature?: {
    wordClickedFeatureLimit?: number;
    onClick?: (params: {
      word: string;
      clientX: number;
      clientY: number;
    }) => void;
  };
}) {
  const wordClickedFeatureEnabled = Boolean(
    props.workClickedFeature &&
      props.value.length <
        (props.workClickedFeature.wordClickedFeatureLimit ?? 200)
  );

  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <TextField
      onClick={(evt) => {
        if (!wordClickedFeatureEnabled) {
          return;
        }
        const selectionStart = ref.current?.selectionStart;
        const value = ref.current?.value;
        if (selectionStart && value) {
          const word = getSelectedWord(selectionStart, value);
          if (word !== null) {
            props.workClickedFeature?.onClick?.({
              word,
              clientX: evt.clientX,
              clientY: evt.clientY,
            });
          }
        }
      }}
      inputRef={ref}
      multiline
      fullWidth
      variant="filled"
      placeholder={props.placeholder}
      minRows={props.minRows}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
