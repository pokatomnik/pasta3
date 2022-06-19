import * as React from 'react';

export function Require<T extends unknown>(props: {
  value: T | null | undefined;
  children: (value: T) => React.ReactNode;
}) {
  if (props.value === null || props.value === undefined) {
    return <React.Fragment />;
  }

  return <React.Fragment>{props.children(props.value)}</React.Fragment>;
}
