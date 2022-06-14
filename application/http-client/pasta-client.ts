import Axios from 'axios';
import type { PathResolver } from './path-resolver';
import type { UrlSchema, InferParams } from '../services/url-schema';

export class PastaClient {
  public constructor(
    private readonly params: {
      pathResolver: PathResolver;
      urlSchema: UrlSchema;
    }
  ) {}

  public pasta(...args: InferParams<'pasta'>) {
    const path = this.params.pathResolver.resolve(
      this.params.urlSchema.pasta().resolve(...args)
    );
  }

  public pastaById(...args: InferParams<'pastaById'>) {
    const path = this.params.pathResolver.resolve(
      this.params.urlSchema.pastaById().resolve(...args)
    );
  }
}
