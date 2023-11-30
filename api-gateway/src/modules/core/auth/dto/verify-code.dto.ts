import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { AUTHCODE_TYPES } from "../interfaces/authcode-types.enum";

export class VerifyCodeDto {
    
    @IsString()
    @MinLength(5)
    @MaxLength(5)
    readonly code: string;

    @IsEnum( AUTHCODE_TYPES )
    readonly type: AUTHCODE_TYPES;
}