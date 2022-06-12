import * as React from 'react';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export function RequireSession(props: {
  children: ((session: Session) => React.ReactNode) | React.ReactNode;
}) {
  const session = useSession();

  if (session.status !== 'authenticated') {
    return <React.Fragment />;
  }

  const children =
    typeof props.children === 'function'
      ? props.children(session.data)
      : props.children;

  return <React.Fragment>{children}</React.Fragment>;
}
