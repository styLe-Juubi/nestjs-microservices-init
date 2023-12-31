export enum RabbitMQ {
    MailQueue = 'mail',
}

export enum MailMSG {
    // USER
    WELCOME_USER = 'WELCOME_USER',
    TWO_STEP_AUTH = 'TWO_STEP_AUTH',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
    NEW_PASSWORD = 'NEW_PASSWORD',
    VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
    SEND_REQUEST_CUSTOMER_ROLE = 'SEND_REQUEST_CUSTOMER_ROLE',
    REQUEST_CUSTOMER_ROLE = 'REQUEST_CUSTOMER_ROLE',

    // CUSTOMER
    CUSTOMER_CREATED = 'CUSTOMER_CREATED',
    CUSTOMER_VERIFIED = 'CUSTOMER_VERIFIED',
    CUSTOMER_ACTIVE = 'CUSTOMER_ACTIVE',
    CUSTOMER_INACTIVE = 'CUSTOMER_INACTIVE',

    // PAYMENT
    RECEIPT_GENERATED = 'RECEIPT_GENERATED',
}