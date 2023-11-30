import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    PORT: Joi.number().required(),
    API_URL: Joi.string().required(),
    API_VERSION: Joi.string().required(),
    MONGO_DB: Joi.string().default(''), // This lane is required if u use MongoDB and NestPassport JWT
    AMQP_URL: Joi.string().default(''), // This lane is required if u use MongoDB and NestPassport JWT
    JWT_SECRET: Joi.string().default(''), // This lane is required if u use MongoDB and NestPassport JWT
    JWT_EXPIRES_IN: Joi.string().default(''), // This lane is required if u use MongoDB and NestPassport JWT
    FILE_VALID_EXTENSIONS: Joi.string().default('jpg,jpeg,png,gif'),
    FILE_MAX_SIZE: Joi.number().default(1000000),
    CLOUD_PLATFORM: Joi.string().default('GCP'),
    AWS_S3_ACCESS_KEY_ID: Joi.string().default('none'),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string().default('none'),
    AWS_S3_BUCKET_NAME: Joi.string().default('none'),
    GCLOUD_PROJECT_ID: Joi.string(),
    GCLOUD_TYPE: Joi.string(),
    GCLOUD_PRIVATE_KEY_ID: Joi.string(),
    GCLOUD_PRIVATE_KEY: Joi.string(),
    GCLOUD_CLIENT_EMAIL: Joi.string(),
    GCLOUD_CLIENT_ID: Joi.string(),
    GCLOUD_AUTH_URI: Joi.string(),
    GCLOUD_TOKEN_URI: Joi.string(),
    GCLOUD_AUTH_PROVIDER_X509_CERT_URL: Joi.string(),
    GCLOUD_CLIENT_X509_CERT_URL: Joi.string(),
    GCLOUD_UNIVERSE_DOMAIN: Joi.string(),
    GCLOUD_STORAGE_ACCESS_KEY: Joi.string(),
    GCLOUD_STORAGE_SECRET_KEY: Joi.string(),
    GCLOUD_STORAGE_BUCKET_NAME: Joi.string(),
})