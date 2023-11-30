import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    AMQP_URL: Joi.string().required(),
    MAIL_HOST: Joi.string().required(),
    MAIL_USER: Joi.string().required(),
    MAIL_PASS: Joi.string().required(),
    MAIL_FROM: Joi.string().required(),
    SMS_ACCOUNT_SID: Joi.string().required(),
    SMS_AUTH_TOKEN: Joi.string().required(),
    SMS_MESSAGING_SERVICE_SID: Joi.string().required(),
})