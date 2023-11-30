import { Type } from "class-transformer";
import { IsArray, IsDefined, IsMongoId, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";

class Roles {

    @IsArray()
    @IsString({ each: true })
    readonly roles: string[];
}

export class AcceptedCustomerRole {

    @IsMongoId()
    readonly id: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Roles)
    readonly dto: Roles;
}