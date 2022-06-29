import Joi from 'joi';

export const MIN_PASTA_TITLE_LENGTH = 1;

export const MAX_PASTA_TITLE_LENGTH = 120;

export const MIN_PASTA_LENGTH = 1;

export const MAX_PASTA_LENGTH = 4000;

export function createPastaValidator(): Joi.ObjectSchema<{
  name: string;
  content: string;
  encrypted: boolean;
}> {
  return Joi.object({
    name: Joi.string()
      .required()
      .min(MIN_PASTA_TITLE_LENGTH)
      .max(MAX_PASTA_TITLE_LENGTH),
    content: Joi.string()
      .required()
      .min(MIN_PASTA_LENGTH)
      .max(MAX_PASTA_LENGTH),
    encrypted: Joi.boolean().required(),
  }).strict();
}
