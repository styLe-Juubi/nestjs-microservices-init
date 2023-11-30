export enum RabbitMQ {
    UserQueue = 'users',
}

export enum UserMSG {
    CREATE = 'CREATE_USER',
    CREATE_USER_CUSTOMER = 'CREATE_USER_CUSTOMER',
    FIND_ALL = 'FIND_USERS',
    FIND_ONE = 'FIND_USER',
    FIND_BY_USERNAME = 'FIND_BY_USERNAME_USERS',
    FIND_BY_EMAIL_OR_PHONE = 'FIND_BY_EMAIL_OR_PHONE',
    UPDATE = 'UPDATE_USER',
    ACCEPTED_CUSTOMER_ROLE = 'ACCEPTED_CUSTOMER_ROLE',
    VERIFY = 'VERIFY_USER',
    NEW_PASSWORD = 'NEW_PASSWORD',
    DELETE = 'DELETE_USER',
    INACTIVE = 'INACTIVE_USER',
    VALID_USER = 'VALID_USER',
    REMOVE_ALL_FILES_FROM = 'REMOVE_ALL_FILES_FROM',
    REMOVE_FILE_FROM = 'REMOVE_FILE_FROM',
}