import Axios from 'axios';
import type { PathResolver } from './path-resolver';
import type { UrlSchema } from '../services/url-schema';
import { Pasta } from '../../domain/pasta';

export class PastaClient {
  public constructor(
    private readonly params: {
      pathResolver: PathResolver;
      urlSchema: UrlSchema;
    }
  ) {}

  public async createPasta(name: string, content: string) {
    const url = this.params.pathResolver.resolve(
      this.params.urlSchema.pasta().resolve()
    );
    const response = await Axios.post<Pasta>(url, { name, content });
    return response.data;
  }

  public async getAllPastas(from = 0, limit = Number.MAX_SAFE_INTEGER) {
    const url = this.params.pathResolver.resolve(
      this.params.urlSchema.pastaFromLimit().resolve(from, limit)
    );
    const response = await Axios.get<Array<Pasta>>(url);
    return response.data;
  }

  public async pastaById(id: string) {
    const url = this.params.pathResolver.resolve(
      this.params.urlSchema.pastaById().resolve(id)
    );
    const response = await Axios.get<Pasta>(url);
    return response.data;
  }

  public async removePastaById(id: string) {
    const url = this.params.pathResolver.resolve(
      this.params.urlSchema.pastaById().resolve(id)
    );
    return await Axios.delete<void>(url);
  }
}
