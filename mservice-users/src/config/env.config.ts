export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    amqpUrl: process.env.AMQP_URL,
    mongodb: process.env.MONGODB,
    appUrl: process.env.APP_URL || `https://localhost:${ process.env.PORT }`,
    pagination: {
        defaultPage: +process.env.PAGINATION_DEFAULT_PAGE,
        defaultLimit: +process.env.PAGINATION_DEFAULT_LIMIT,
        defaultOrder: { 
            sort: { _id: +process.env.PAGINATION_DEFAULT_ORDER }
        },
    },
});