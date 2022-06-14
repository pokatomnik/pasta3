import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import { RestrictedController } from '../../lib/router';
import { InvalidRequestError, ServerError } from '../../lib/http-errors';
import type { Pasta } from '../../domain/pasta';
import { IStore } from '../../lib/store';

export class PastaCreateController extends RestrictedController {
  public constructor(
    private readonly params: {
      store: IStore;
      validator: Joi.ObjectSchema<{
        name: string;
        content: string;
      }>;
    }
  ) {
    super();
  }

  public override async post(
    request: NextApiRequest,
    response: NextApiResponse<Pasta | InvalidRequestError>
  ) {
    return this.requireSessionWithEmail(request, response, (session) => {
      return this.requireBody(
        request,
        response,
        this.params.validator,
        async (body) => {
          try {
            const result = await this.params.store.pastaStore.createPasta(
              session.user.email,
              body.name,
              body.content
            );
            return response.status(201).json(result);
          } catch (e) {
            const error = new ServerError(
              'PASTA_CREATE_FAILED',
              'Failed to create pasta'
            );
            return response.status(error.status).json(error);
          }
        }
      );
    });
  }
}
