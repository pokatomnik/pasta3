import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { NotFoundError, InvalidRequestError } from '../http-errors';
import type { ObjectSchema } from 'joi';

export class Controller {
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

  protected requireQuery<T extends object>(
    req: NextApiRequest,
    res: NextApiResponse,
    schema: ObjectSchema<T>,
    queryHandler: (queryParsed: T) => void
  ) {
    const validationResult = schema.validate(req.query);
    if (validationResult.error) {
      const error = new InvalidRequestError(
        'INCORRECT_QUERY',
        'The path you provided does not match required schema'
      );
      return res.status(error.status).json(error);
    }
    return queryHandler(validationResult.value);
  }

  protected requireBody<T extends object>(
    req: NextApiRequest,
    res: NextApiResponse,
    schema: ObjectSchema<T>,
    bodyHandler: (bodyParsed: T) => void
  ) {
    let bodyParsed: T;
    try {
      bodyParsed = JSON.parse(req.body);
    } catch (e) {
      const error = new InvalidRequestError(
        'CORRUPTED_BODY',
        'The body you provided does not match required schema'
      );
      return res.status(error.status).json(error);
    }

    const validationResult = schema.validate(bodyParsed);
    if (validationResult.error) {
      const error = new InvalidRequestError(
        'INCORRECT_BODY',
        'The body you provided does not match required schema'
      );
      return res.status(error.status).json(error);
    }
    return bodyHandler(validationResult.value);
  }

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
      if (!httpMethod || !Controller.HTTP_METHODS.has(httpMethod)) {
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
