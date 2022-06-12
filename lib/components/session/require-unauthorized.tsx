import * as React from 'react';
import { useSession } from 'next-auth/react';

export function RequireUnauthorized(props: React.PropsWithChildren<object>) {
  const session = useSession();

  if (session.status !== 'unauthenticated') {
    return <React.Fragment />;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
}
