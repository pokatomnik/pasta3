import type { NextApiResponse } from 'next';
import { Controller } from '../../lib/router';

export class HelloController extends Controller {
  public override get(_: unknown, response: NextApiResponse<{ foo: 1 }>) {
    response.json({ foo: 1 });
  }

  public override post(_: unknown, response: NextApiResponse<{ foo: 2 }>) {
    response.json({ foo: 2 });
  }
}
