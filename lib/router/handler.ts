import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { NotFoundError } from '../http-errors';

export abstract class Handler {
  private static HTTP_METHODS = new Set<string>([
    'get',
    'head',
    'post',
    'put',
    'delete',
    'connect',
    'options',
    'trace',
    'patch',
  ]);

  protected defaultNotFound(_: unknown, res: NextApiResponse) {
    const error = new NotFoundError('NOT_FOUND', 'Cannot process the request');
    res.status(error.status).json(error);
  }

  protected get(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected head(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected post(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected put(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected delete(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected connect(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected options(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected trace(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  protected patch(req: NextApiRequest, res: NextApiResponse<unknown>) {
    this.defaultNotFound(req, res);
  }

  public internalHandle(): NextApiHandler<unknown> {
    return (request, response) => {
      const httpMethod = request.method?.toLocaleLowerCase();
      if (!httpMethod || !Handler.HTTP_METHODS.has(httpMethod)) {
        return this.defaultNotFound(request, response);
      }
      switch (httpMethod) {
        case 'get':
          return this.get(request, response);
        case 'head':
          return this.head(request, response);
        case 'post':
          return this.post(request, response);
        case 'put':
          return this.put(request, response);
        case 'delete':
          return this.delete(request, response);
        case 'connect':
          return this.connect(request, response);
        case 'options':
          return this.options(request, response);
        case 'trace':
          return this.trace(request, response);
        case 'patch':
          return this.patch(request, response);
        default:
          return this.defaultNotFound(request, response);
      }
    };
  }
}
