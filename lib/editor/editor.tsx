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
  selectAllAtFirstClick?: boolean;
  onWordClick?: (params: {
    word: string;
    clientX: number;
    clientY: number;
  }) => void;
}) {
  const shouldSelectAll = React.useRef(!props.selectAllAtFirstClick);

  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const trySelectWord = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const selectionStart = inputRef.current?.selectionStart;
    const selectionEnd = inputRef.current?.selectionEnd;
    if (selectionStart !== selectionEnd) {
      return;
    }
    const value = inputRef.current?.value;
    if (selectionStart === undefined || value === undefined) {
      return;
    }
    const word = getSelectedWord(selectionStart, value);
    if (word !== null) {
      props.onWordClick?.({
        word,
        clientX: evt.clientX,
        clientY: evt.clientY,
      });
    }
  };

  const selectAllIfNotYet = () => {
    if (shouldSelectAll.current) {
      return false;
    }
    shouldSelectAll.current = true;
    inputRef.current?.focus();
    inputRef.current?.select();
    return true;
  };

  return (
    <TextField
      onClick={(evt) => {
        if (!selectAllIfNotYet()) {
          trySelectWord(evt);
        }
      }}
      inputRef={inputRef}
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
