import * as React from 'react';
import { HttpClient } from './http-client';

export const Context = React.createContext<HttpClient>(new HttpClient());
