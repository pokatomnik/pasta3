import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';
import { Pasta } from '../../domain/pasta';
import { ServerError } from '../../lib/http-errors';
import { CustomSession, RestrictedController } from '../../lib/router';
import type { IStore } from '../../lib/store';

export class PastaController extends RestrictedController {
  public constructor(
    private readonly params: {
      store: IStore;
      getValidator: Joi.ObjectSchema<{
        id: string | undefined;
        from: number | undefined;
        limit: number | undefined;
      }>;
      deleteValidator: Joi.ObjectSchema<{ id: string }>;
      createValidator: Joi.ObjectSchema<{
        name: string;
        content: string;
      }>;
    }
  ) {
    super();
  }

  public override async post(
    request: NextApiRequest,
    response: NextApiResponse<Pasta | ServerError>
  ) {
    return this.requireSessionWithEmail(request, response, (session) => {
      return this.requireBody(
        request,
        response,
        this.params.createValidator,
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

  public override async delete(
    request: NextApiRequest,
    response: NextApiResponse<ServerError | void>
  ) {
    return this.requireSessionWithEmail(request, response, (session) => {
      return this.requireQuery(
        request,
        response,
        this.params.deleteValidator,
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

  public override async get(
    req: NextApiRequest,
    res: NextApiResponse<unknown>
  ) {
    this.requireSessionWithEmail(req, res, (session) => {
      this.requireQuery(req, res, this.params.getValidator, (query) => {
        if (query.id !== undefined) {
          this.getById(query.id, session, res);
        } else {
          this.getByPagination(query.from, query.limit, session, res);
        }
      });
    });
  }

  public async getById(
    id: string,
    session: CustomSession,
    response: NextApiResponse<ServerError | Pasta | null>
  ) {
    try {
      const pasta = await this.params.store.pastaStore.getPasta(
        session.user.email,
        id
      );
      return response.status(200).json(pasta);
    } catch (e) {
      const error = new ServerError('GET_PASTA_FAILED', 'Failed to get pasta');
      return response.status(error.status).json(error);
    }
  }

  public async getByPagination(
    from: number = 0,
    limit: number = Number.MAX_SAFE_INTEGER,
    session: CustomSession,
    response: NextApiResponse<ServerError | Array<Pasta>>
  ) {
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
}
