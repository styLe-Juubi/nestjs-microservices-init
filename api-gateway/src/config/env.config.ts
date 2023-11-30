export const EnvConfiguration = () => ({
    port: +process.env.PORT,
    apiUrl: process.env.API_URL,
    apiVersion: process.env.API_VERSION,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    mongoDB: process.env.MONGO_DB,
    amqpUrl: process.env.AMQP_URL,
    uploadFilesSettings: {
        validExtensions: process.env.FILE_VALID_EXTENSIONS.split(','),
        fileMaxSize: +process.env.FILE_MAX_SIZE,
    },
    cloudPlatform: process.env.CLOUD_PLATFORM,
    aws: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    gcp: {
        projectId: process.env.GCLOUD_PROJECT_ID,
        credentials: {
            type: process.env.GCLOUD_TYPE,
            project_id: process.env.GCLOUD_PROJECT_ID,
            private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID,
            private_key: process.env.GCLOUD_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
            client_email: process.env.GCLOUD_CLIENT_EMAIL,
            client_id: process.env.GCLOUD_CLIENT_ID,
            auth_uri: process.env.GCLOUD_AUTH_URI,
            token_uri: process.env.GCLOUD_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.GCLOUD_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.GCLOUD_CLIENT_X509_CERT_URL,
            universe_domain: process.env.GCLOUD_UNIVERSE_DOMAIN,
        },
        cloudStorage: {
            acessKey: process.env.GCLOUD_STORAGE_ACCESS_KEY,
            secretKey: process.env.GCLOUD_STORAGE_SECRET_KEY,
            bucketName: process.env.GCLOUD_STORAGE_BUCKET_NAME,
        }
    }
});