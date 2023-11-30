import { IsDefined, IsMongoId, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import { UpdateUserDto } from "./update-user.dto";
import { Type } from "class-transformer";

export class UpdateUserPayloadDto {

    @IsMongoId()
    readonly id: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateUserDto)
    readonly dto: UpdateUserDto;
}