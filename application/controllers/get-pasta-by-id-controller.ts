import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { ServerError } from '../../lib/http-errors';
import { RestrictedController } from '../../lib/router';
import type { IStore } from '../../lib/store';

export class GetPastaByIdController extends RestrictedController {
  public constructor(
    private readonly params: {
      store: IStore;
      validator: Joi.ObjectSchema<{ id: string }>;
    }
  ) {
    super();
  }

  public override async get(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
  ) {
    return this.requireSessionWithEmail(request, response, async (session) => {
      return this.requireQuery(
        request,
        response,
        this.params.validator,
        async (query) => {
          try {
            const pasta = await this.params.store.pastaStore.getPasta(
              session.user.email,
              query.id
            );
            return response.status(200).json(pasta);
          } catch (e) {
            const error = new ServerError(
              'GET_PASTA_FAILED',
              'Failed to get pasta'
            );
            return response.status(error.status).json(error);
          }
        }
      );
    });
  }
}
