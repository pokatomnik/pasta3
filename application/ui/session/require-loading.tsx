import * as React from 'react';
import { useSession } from 'next-auth/react';

export function RequireLoading(props: React.PropsWithChildren<object>) {
  const session = useSession();

  if (session.status !== 'loading') {
    return <React.Fragment />;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
}
