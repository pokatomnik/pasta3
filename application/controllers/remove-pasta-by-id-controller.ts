import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { ServerError } from '../../lib/http-errors';
import { RestrictedController } from '../../lib/router';
import type { IStore } from '../../lib/store';

export class RemovePastaByIdController extends RestrictedController {
  public constructor(
    private readonly params: {
      store: IStore;
      validator: Joi.ObjectSchema<{ id: string }>;
    }
  ) {
    super();
  }

  public override async delete(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
  ) {
    return this.requireSessionWithEmail(request, response, (session) => {
      return this.requireQuery(
        request,
        response,
        this.params.validator,
        async (query) => {
          try {
            await this.params.store.pastaStore.deletePasta(
              session.user.email,
              query.id
            );
            return response.status(200).end();
          } catch (e) {
            const error = new ServerError(
              'FAILED_REMOVE_PASTA',
              'Failed to remove pasta'
            );
            return response.status(error.status).json(error);
          }
        }
      );
    });
  }
}
