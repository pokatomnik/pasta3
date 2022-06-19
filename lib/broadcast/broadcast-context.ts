import * as React from 'react';
import { Broadcast } from './broadcast';

export const BroadcastContext = React.createContext<Broadcast | null>(null);
