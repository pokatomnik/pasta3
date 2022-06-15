import Joi from 'joi';
import { Router, Controller } from '../lib/router';
import { HelloController } from './controllers/hello-controller';
import { PastaController } from './controllers/pasta-controller';
import type { IStore } from '../lib/store';
import { Store } from './services/store';
import { UrlSchema } from './services/url-schema';

export class Application {
  private readonly store: IStore = new Store();

  private readonly urlSchema = new UrlSchema({ version: 1 });

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
    .addHandler(this.urlSchema.hello().pattern, this.controllers.hello)
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
