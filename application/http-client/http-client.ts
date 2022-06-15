import { UrlSchema } from '../services/url-schema';
import { PastaClient } from './pasta-client';
import { PathResolver } from './path-resolver';

export class HttpClient {
  private readonly pathResolver: PathResolver = {
    resolve(p: string) {
      return `/api?p=${p}`;
    },
  };

  public readonly pastaClient = new PastaClient({
    urlSchema: new UrlSchema({ version: 1 }),
    pathResolver: this.pathResolver,
  });
}
