import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { InvalidRequestError, ServerError } from '../../lib/http-errors';
import { RestrictedController } from '../../lib/router';
import { IStore } from '../../lib/store';

export class GetPastaByIdController extends RestrictedController {
  public constructor(
    private readonly params: {
      store: IStore;
    }
  ) {
    super();
  }

  private readonly validator = Joi.string().required().length(24);

  public override async get(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
  ) {
    return this.requireSessionWithEmail(request, response, async (session) => {
      const validationResult: Joi.ValidationResult<string> =
        this.validator.validate(request.query.id);

      if (validationResult.error) {
        const error = new InvalidRequestError(
          'INVALID_ID',
          'Invalid pasta identifier'
        );
        return response.status(error.status).json(error);
      }

      try {
        const pasta = await this.params.store.pastaStore.getPasta(
          session.user.email,
          validationResult.value
        );
        return response.status(200).json(pasta);
      } catch (e) {
        const error = new ServerError(
          'GET_PASTA_FAILED',
          'Failed to get pasta'
        );
        return response.status(error.status).json(error);
      }
    });
  }
}
