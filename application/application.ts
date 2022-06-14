import { Router, Controller } from '../lib/router';
import { HelloController } from './controllers/hello-controller';
import { GetPastaByIdController } from './controllers/get-pasta-by-id-controller';
import { PastaCreateController } from './controllers/pasta-create-controller';
import type { IStore } from '../lib/store';
import { Store } from './services/store';

export class Application {
  private readonly store: IStore = new Store();

  private readonly router = new Router({
    notFoundHandler: new Controller(),
  })
    .addHandler('/v1/hello', new HelloController())
    .addHandler(
      '/v1/pastas/create',
      new PastaCreateController({
        store: this.store,
      })
    )
    .addHandler(
      '/v1/pastas/{id}',
      new GetPastaByIdController({ store: this.store })
    );

  public getDefaultNotFoundHandler() {
    return this.router.notFoundHandler();
  }

  public getNextHandler(path: string) {
    return this.router.nextHandler(path);
  }
}
