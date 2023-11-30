import { AUTHCODE_TYPES } from "../enums/authcode-types.enum";
import { IDeviceInfo } from "./device-info.interface";

export interface IAuthcode {
    userId: string;
    code: string;
    type: AUTHCODE_TYPES;
    deviceInfo: IDeviceInfo;
    createdAt: Date;
}