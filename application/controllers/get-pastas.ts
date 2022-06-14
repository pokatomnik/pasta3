import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { Pasta } from '../../domain/pasta';
import { ServerError } from '../../lib/http-errors';
import { RestrictedController } from '../../lib/router';
import type { IStore } from '../../lib/store';

export class GetPastasController extends RestrictedController {
  public constructor(
    private readonly params: {
      store: IStore;
      validator: Joi.ObjectSchema<{
        from?: number;
        limit?: number;
      }>;
    }
  ) {
    super();
  }

  public override async get(
    request: NextApiRequest,
    response: NextApiResponse<ServerError | Array<Pasta>>
  ) {
    return this.requireSessionWithEmail(request, response, (session) => {
      return this.requireQuery(
        request,
        response,
        this.params.validator,
        async (query) => {
          const { from = 0, limit = Number.MAX_SAFE_INTEGER } = query;
          try {
            const pastas = await this.params.store.pastaStore.getPastas(
              session.user.email,
              from,
              limit
            );
            return response.json(pastas);
          } catch (e) {
            const error = new ServerError(
              'FAILED_GET_PASTAS',
              'Failed to get all pastas'
            );
            return response.status(error.status).json(error);
          }
        }
      );
    });
  }
}
