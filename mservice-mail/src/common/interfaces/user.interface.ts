import { MULTIFACTOR_AUTH_TYPES } from "../enums/multifactor-auth.enum";

export interface IUser {
    _id: string;
    uuid: string;
    username: string;
    email?: string;
    country_code?: number;
    phone?: number;
    password?: string;
    name?: string;
    surname?: string;
    bio?: string;
    avatar?: string[];
    background?: string[];
    roles: string[];
    banned: boolean;
    banned_until?: Date;
    online: boolean;
    multifactor_auth: MULTIFACTOR_AUTH_TYPES;
    oauth: boolean;
    verified: boolean;
    active: boolean;
}