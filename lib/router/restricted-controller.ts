import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Controller } from './controller';
import { getSession } from 'next-auth/react';
import { ISODateString } from 'next-auth';
import { ServerError, UnauthorizedError } from '../http-errors';

export interface CustomSession {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  expires: ISODateString;
}

export abstract class RestrictedController extends Controller {
  protected async requireSessionWithEmail(
    req: NextApiRequest,
    res: NextApiResponse,
    handlerWithSession: (session: CustomSession) => void
  ) {
    try {
      const originalSession = await getSession({ req });
      if (!originalSession) {
        throw new Error('Unauthorized');
      }
      const { expires, user } = originalSession;
      if (!user) {
        throw new Error('No user in session');
      }
      const { email } = user;
      if (!email) {
        throw new Error('No user email in session');
      }
      return handlerWithSession({
        expires,
        user: {
          ...user,
          email,
        },
      });
    } catch (e) {
      if (res.headersSent) {
        return;
      }
      const errorOriginal: Error =
        e instanceof Error ? e : new Error('Unknown error');
      const error = new UnauthorizedError('UNAUTHORIED', errorOriginal.message);
      return res.status(error.status).json(error);
    }
  }

  public override internalHandle(): NextApiHandler<unknown> {
    const originalHandler = super.internalHandle();
    return async (request, response) => {
      try {
        const session = await getSession({ req: request });
        if (session) {
          return originalHandler(request, response);
        } else {
          const error = new UnauthorizedError(
            'UNAUTHORIZED',
            'User is not authorized'
          );
          return response.status(error.status).json(error);
        }
      } catch (e) {
        const error = new ServerError(
          'SESSION_FAILED',
          'Failed to get session'
        );
        return response.status(error.status).json(error);
      }
    };
  }
}
