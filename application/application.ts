import Joi from 'joi';
import { Router, Controller } from '../lib/router';
import { HelloController } from './controllers/hello-controller';
import { GetPastaByIdController } from './controllers/get-pasta-by-id-controller';
import { PastaCreateController } from './controllers/pasta-create-controller';
import { GetPastasController } from './controllers/get-pastas';
import { RemovePastaByIdController } from './controllers/remove-pasta-by-id-controller';
import type { IStore } from '../lib/store';
import { Store } from './services/store';

export class Application {
  private readonly store: IStore = new Store();

  private readonly controllers = {
    notFound: new Controller(),
    hello: new HelloController(),
    pastaCreate: new PastaCreateController({
      store: this.store,
      validator: Joi.object({
        name: Joi.string().required().min(1),
        content: Joi.string().required().min(1),
      }).strict(),
    }),
    pastaById: new GetPastaByIdController({
      store: this.store,
      validator: Joi.object({
        id: Joi.string()
          .required()
          .length(this.store.pastaStore.identifierLength),
      }).required(),
    }),
    pastasGet: new GetPastasController({
      store: this.store,
      validator: Joi.object({
        from: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
        limit: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
      }).required(),
    }),
    pastaRemove: new RemovePastaByIdController({
      store: this.store,
      validator: Joi.object({
        id: Joi.string()
          .required()
          .length(this.store.pastaStore.identifierLength),
      }).required(),
    }),
  };

  private readonly router = new Router({
    notFoundHandler: this.controllers.notFound,
  })
    .addHandler('/v1/hello', this.controllers.hello)
    .addHandler('/v1/pastas/create', this.controllers.pastaCreate)
    .addHandler('/v1/pastas/id/{id}', this.controllers.pastaById)
    .addHandler('/v1/pastas/all', this.controllers.pastasGet)
    .addHandler('/v1/pastas/all/{from}', this.controllers.pastasGet)
    .addHandler('/v1/pastas/all/{from}/{limit}', this.controllers.pastasGet);

  public getDefaultNotFoundHandler() {
    return this.router.notFoundHandler();
  }

  public getNextHandler(path: string) {
    return this.router.nextHandler(path);
  }
}
