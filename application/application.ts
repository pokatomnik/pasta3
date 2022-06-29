import { Router, Controller } from '../lib/router';
import { PastaController } from './controllers/pasta-controller';
import type { IStore } from '../lib/store';
import { Store } from './services/store';
import { UrlSchema } from './services/url-schema';
import * as Validators from './validators';

export class Application {
  private readonly store: IStore = new Store();

  private readonly urlSchema = new UrlSchema({ version: 1 });

  private readonly controllers = {
    notFound: new Controller(),
    pasta: new PastaController({
      store: this.store,
      createValidator: Validators.createPastaValidator(),
      deleteValidator: Validators.deletePastaValidator(
        this.store.pastaStore.identifierLength
      ),
      getValidator: Validators.getPastaValidator(
        this.store.pastaStore.identifierLength
      ),
    }),
  };

  private readonly router = new Router({
    notFoundHandler: this.controllers.notFound,
  })
    .addHandler(this.urlSchema.pasta().pattern, this.controllers.pasta)
    .addHandler(this.urlSchema.pastaById().pattern, this.controllers.pasta)
    .addHandler(this.urlSchema.pastaFrom().pattern, this.controllers.pasta)
    .addHandler(
      this.urlSchema.pastaFromLimit().pattern,
      this.controllers.pasta
    );

  public getDefaultNotFoundHandler() {
    return this.router.notFoundHandler();
  }

  public getNextHandler(path: string) {
    return this.router.nextHandler(path);
  }
}
