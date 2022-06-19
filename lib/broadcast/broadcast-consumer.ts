import * as React from 'react';
import { BroadcastContext } from './broadcast-context';

export function useDispatcher() {
  const broadcastContext = React.useContext(BroadcastContext);
  if (broadcastContext === null) {
    throw new Error('No Broadcast Provider');
  }
  return broadcastContext.getDispatcher();
}

export function useSubscriber() {
  const broadcastContext = React.useContext(BroadcastContext);
  if (broadcastContext === null) {
    throw new Error('No Broadcast Provider');
  }
  return broadcastContext.getSubscriber();
}
