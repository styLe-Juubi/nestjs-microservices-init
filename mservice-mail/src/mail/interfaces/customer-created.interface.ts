interface IUser {
    name: string;
    surname: string;
    email: string;
    country_code: number;
    phone: number;
}

interface IPlan {
    name: string;
    description: string;
    pay_each: string;
    price: number;
}

interface ICustomer {
    name: string;
    location: string;
}

interface IPayment {
    payment_method: string;
    plan_start_date: string;
    payment_date: string;
    payday_limit: string;
    status: string;
    payment_url?: string;
}

export interface ICustomerCreated {
    user: IUser;
    plan: IPlan;
    customer: ICustomer;
    payment: IPayment;
}