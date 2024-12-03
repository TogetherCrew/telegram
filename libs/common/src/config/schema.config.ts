import * as Joi from 'joi';

export const schemaConfig = Joi.object({
  RMQ_HOST: Joi.string().required(),
  RMQ_PORT: Joi.number().default(5672),
  RMQ_USER: Joi.string().required(),
  RMQ_PASS: Joi.string().required(),

  TELEGRAM_TOKEN: Joi.string().required(),

  MONGO_HOST: Joi.string().required(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_USER: Joi.string().required(),
  MONGO_PASS: Joi.string().required(),

  NEO4J_HOST: Joi.string().required(),
  NEO4J_PORT: Joi.number().default(7687),
  NEO4J_USER: Joi.string().required(),
  NEO4J_PASS: Joi.string().required(),

  TEMPORAL_URI: Joi.string().default('localhost:7233'),
  TEMPORAL_QUEUE: Joi.string().default('TEMPORAL_QUEUE_LIGHT'),
});
