import { MULTIFACTOR_AUTH_TYPES } from "src/common/enums/multifactor-auth.enum";
import { IDeviceInfo } from "src/common/interfaces/device-info.interface";
import { IUser } from "src/common/interfaces/user.interface";

export interface INewPassword {
    user: IUser;
    deviceInfo: IDeviceInfo;
    service: MULTIFACTOR_AUTH_TYPES;
}