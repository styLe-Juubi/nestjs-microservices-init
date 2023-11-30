import { IsEnum, IsMongoId } from "class-validator";
import { IMAGE_TYPES } from "../enums/image-types.enum";

export class RemoveFilesFromDto {

    @IsEnum( IMAGE_TYPES )
    readonly type: IMAGE_TYPES;

    @IsMongoId()
    readonly id: string;
}