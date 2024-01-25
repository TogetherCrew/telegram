import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  PORT: Joi.number().default(3000),

  NEO4J_HOST: Joi.string().required(),
  NEO4J_PORT: Joi.number().required(),
  NEO4J_USERNAME: Joi.string().required(),
  NEO4J_PASSWORD: Joi.string().required(),

  API_ID: Joi.number().required(),
  API_HASH: Joi.string().required(),
  SESSION: Joi.string().required(),
});
