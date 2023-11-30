interface IPlan {
    _id:         string;
    name:        string;
    description: string;
    pay_each:    string;
    price:       number;
}

interface IPayment {
    _id:             string;
    uuid:            string;
    user:            string;
    customer:        string;
    plan:            IPlan;
    payment_method:  string;
    plan_start_date: string;
    payment_date:    string;
    payment_made_date: string;
    payday_limit:    string;
    status:          string;
    active:          boolean;
    createdAt:       string;
    updatedAt:       string;
}

interface ICustomer {
    name: string;
    location: string;
}

interface IUser {
    _id: string;
    uuid: string;
    username: string;
    email?: string;
    country_code?: number;
    phone?: number;
    name?: string;
    surname?: string;
    gender?: string;
    bio?: string;
    avatar?: string[];
    background?: string[];
    roles?: string[];
    banned: boolean;
    banned_until?: Date;
    online: boolean;
    multifactor_auth?: string;
    oauth: boolean;
    verified: boolean;
    active: boolean;
}

export interface IReceiptGenerated {
    _id:       string;
    uuid:      string;
    payment:   IPayment;
    customer: ICustomer;
    user: IUser;
    active:    boolean;
    createdAt: string;
    updatedAt: string;
}