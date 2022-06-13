import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import { RestrictedHandler } from '../../../lib/router/restricted-handler';
import { InvalidRequestError, ServerError } from '../../../lib/http-errors';
import type { Pasta } from '../../../lib/domain/pasta';
import { registerHandler } from '../../../lib/router';
import { Store } from '../../../lib/store';

class CreateHandler extends RestrictedHandler {
  private readonly store = new Store();

  private readonly validator = Joi.object<{
    name: string;
    content: string;
  }>({
    name: Joi.string().required().min(1),
    content: Joi.string().required().min(1),
  }).strict();

  public override async post(
    request: NextApiRequest,
    response: NextApiResponse<Pasta | InvalidRequestError>
  ) {
    return this.requireSessionWithEmail(request, response, (session) =>
      this.requireBody(request, response, this.validator, async (body) => {
        try {
          const result = await this.store.pastaStore.createPasta(
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
      })
    );
  }
}

export default registerHandler(CreateHandler);
