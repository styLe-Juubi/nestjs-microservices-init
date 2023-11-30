import { MULTIFACTOR_AUTH_TYPES } from "src/common/enums/multifactor-auth.enum";
import { USER_GENDER_TYPES } from "../enums/user-gender-types.enum";

export interface IUser {
    uuid: string;
    username: string;
    email?: string;
    country_code?: number;
    phone?: number;
    name?: string;
    surname?: string;
    gender?: USER_GENDER_TYPES;
    bio?: string;
    avatar?: string[];
    background?: string[];
    roles?: string[];
    banned: boolean;
    banned_until?: Date;
    online: boolean;
    multifactor_auth: MULTIFACTOR_AUTH_TYPES;
    oauth: boolean;
    active: boolean;
}