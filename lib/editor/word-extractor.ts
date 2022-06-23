function isSpace(character: string) {
  return /\s/.test(character);
}

export function getSelectedWord(
  selectionStart: number,
  value: string
): string | null {
  let start: number = selectionStart;
  let end: number = selectionStart;
  while (start - 1 >= 0 && !isSpace(value[start - 1]!)) {
    --start;
  }
  while (end + 1 < value.length && !isSpace(value[end + 1]!)) {
    ++end;
  }
  const word = value.slice(start, end + 1);
  return word || null;
}
