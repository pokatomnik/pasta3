import * as React from 'react';
import { Context } from './context';

export function useHttpClient() {
  return React.useContext(Context);
}
