import { NextApiHandler } from 'next';
import { Handler } from './handler';
import { getSession } from 'next-auth/react';
import { ServerError, UnauthorizedError } from '../http-errors';

export abstract class RestrictedHandler extends Handler {
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
