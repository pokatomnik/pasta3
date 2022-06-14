import { Application } from '../../application';
import type { NextApiRequest, NextApiResponse } from 'next';

class Api {
  private static application = new Application();

  public static async handler(
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    const [path] = new Array<string>().concat(request.query.p ?? []);

    if (path === undefined) {
      const handler = Api.application.getDefaultNotFoundHandler();
      return handler(request, response);
    }
    const handler = Api.application.getNextHandler(path);
    return handler(request, response);
  }
}

export default Api.handler;

/**
 * This also must be exported to tell Next that
 * this API route is handled by an external resolver
 */
export const config = {
  api: {
    externalResolver: true,
  },
};
