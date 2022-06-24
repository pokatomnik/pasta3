import Axios from 'axios';
import noop from 'lodash/noop';
import type { PathResolver } from './path-resolver';
import type { UrlSchema } from '../services/url-schema';
import { Pasta } from '../../domain/pasta';
import { CancellableInvocation } from '../../lib/cancellable';

export class PastaClient {
  public constructor(
    private readonly params: {
      pathResolver: PathResolver;
      urlSchema: UrlSchema;
    }
  ) {}

  public createPasta(
    name: string,
    content: string,
    encrypted: boolean
  ): CancellableInvocation<Pasta> {
    return new CancellableInvocation<Pasta>((signal) => {
      const url = this.params.pathResolver.resolve(
        this.params.urlSchema.pasta().resolve()
      );
      return Axios.post<Pasta>(
        url,
        { name, content, encrypted },
        { signal }
      ).then(({ data }) => data);
    });
  }

  public getAllPastas(
    from = 0,
    limit = Number.MAX_SAFE_INTEGER
  ): CancellableInvocation<Array<Pasta>> {
    return new CancellableInvocation<Array<Pasta>>((signal) => {
      const url = this.params.pathResolver.resolve(
        this.params.urlSchema.pastaFromLimit().resolve(from, limit)
      );
      return Axios.get<Array<Pasta>>(url, { signal }).then(({ data }) => data);
    });
  }

  public pastaById(id: string): CancellableInvocation<Pasta> {
    return new CancellableInvocation<Pasta>((signal) => {
      const url = this.params.pathResolver.resolve(
        this.params.urlSchema.pastaById().resolve(id)
      );
      return Axios.get<Pasta>(url, { signal }).then(({ data }) => data);
    });
  }

  public removePastaById(id: string): CancellableInvocation<void> {
    return new CancellableInvocation<void>((signal) => {
      const url = this.params.pathResolver.resolve(
        this.params.urlSchema.pastaById().resolve(id)
      );
      return Axios.delete<void>(url, { signal }).then(noop);
    });
  }
}
