import Joi from 'joi';

export function deletePastaValidator(identifierLength: number) {
  return Joi.object({
    id: Joi.string().required().length(identifierLength),
  }).required();
}
