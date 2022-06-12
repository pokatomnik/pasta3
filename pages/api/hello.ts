import type { NextApiResponse } from 'next';
import { Handler, registerHandler } from '../../lib/router';

class HelloHandler extends Handler {
  public override get(_: unknown, response: NextApiResponse<{ foo: 1 }>) {
    response.json({ foo: 1 });
  }

  public override post(_: unknown, response: NextApiResponse<{ foo: 2 }>) {
    response.json({ foo: 2 });
  }
}

export default registerHandler(HelloHandler);
