import { REQUEST_STATUS_TYPES } from "src/common/enums/request-status-types.enum";
import { IUser } from "src/common/interfaces/user.interface";

export interface IRequestCustomerRole {
    user: IUser;
    status: REQUEST_STATUS_TYPES;
}