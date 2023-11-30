export const EnvConfiguration = () => ({
    amqpUrl: process.env.AMQP_URL,
    mailService: {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        from: process.env.MAIL_FROM,
    },
    smsService: {
        accountSid: process.env.SMS_ACCOUNT_SID,
        authToken: process.env.SMS_AUTH_TOKEN,
        messagingServiceSid: process.env.SMS_MESSAGING_SERVICE_SID,
    }
});