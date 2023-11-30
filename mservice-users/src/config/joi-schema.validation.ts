import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    AMQP_URL: Joi.string().required(),
    MONGODB: Joi.string().required(),
    PAGINATION_DEFAULT_PAGE: Joi.number().default(1),
    PAGINATION_DEFAULT_LIMIT: Joi.number().default(10),
    PAGINATION_DEFAULT_ORDER: Joi.number().default(-1),
})