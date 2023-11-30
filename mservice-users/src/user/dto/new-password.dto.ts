import { IsMongoId, IsString, MaxLength, MinLength } from "class-validator";

export class NewPasswordDto {

    @IsMongoId()
    id: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    readonly password: string;
}