import { MULTIFACTOR_AUTH_TYPES } from "src/common/enums/multifactor-auth.enum";
import { IAuthcode } from "src/common/interfaces/authcode.interface";
import { IUser } from "src/common/interfaces/user.interface";

export interface IArgs {
    user: IUser;
    authCode: IAuthcode;
    service: MULTIFACTOR_AUTH_TYPES;
}