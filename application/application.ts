import Joi from 'joi';
import { Router, Controller } from '../lib/router';
import { HelloController } from './controllers/hello-controller';
import { PastaController } from './controllers/pasta-controller';
import type { IStore } from '../lib/store';
import { Store } from './services/store';

export class Application {
  private readonly store: IStore = new Store();

  private readonly controllers = {
    notFound: new Controller(),
    hello: new HelloController(),
    pasta: new PastaController({
      store: this.store,
      createValidator: Joi.object({
        name: Joi.string().required().min(1),
        content: Joi.string().required().min(1),
      }).strict(),
      deleteValidator: Joi.object({
        id: Joi.string()
          .required()
          .length(this.store.pastaStore.identifierLength),
      }).required(),
      getValidator: Joi.object({
        id: Joi.string()
          .length(this.store.pastaStore.identifierLength)
          .optional(),
        from: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
        limit: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
      }).required(),
    }),
  };

  private readonly router = new Router({
    notFoundHandler: this.controllers.notFound,
  })
    .addHandler('/v1/hello', this.controllers.hello)
    .addHandler('/v1/pastas', this.controllers.pasta)
    .addHandler('/v1/pastas/id/{id}', this.controllers.pasta)
    .addHandler('/v1/pastas/{from}', this.controllers.pasta)
    .addHandler('/v1/pastas/{from}/{limit}', this.controllers.pasta);

  public getDefaultNotFoundHandler() {
    return this.router.notFoundHandler();
  }

  public getNextHandler(path: string) {
    return this.router.nextHandler(path);
  }
}
