import { IsString, MaxLength, MinLength } from "class-validator";
import { RemoveFilesFromDto } from "./remove-files-from.dto";

export class RemoveFileFromDto extends RemoveFilesFromDto {

    @IsString()
    @MinLength(51)
    @MaxLength(51)
    readonly filename: string;
}