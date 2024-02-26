import * as Joi from 'joi';

export const schemaConfig = Joi.object({
  RMQ_HOST: Joi.string().required(),
  RMQ_PORT: Joi.number().default(5672),
  RMQ_USER: Joi.string().required(),
  RMQ_PASS: Joi.string().required(),

  TELEGRAF_TOKEN: Joi.string().required(),

  MONGO_HOST: Joi.string().required(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_USER: Joi.string().required(),
  MONGO_PASS: Joi.string().required(),
});
