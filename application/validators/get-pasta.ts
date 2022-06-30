import Joi from 'joi';

export function getPastaValidator(identifierLength: number) {
  return Joi.object({
    id: Joi.string().length(identifierLength).optional(),
    from: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
    limit: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
  }).required();
}
