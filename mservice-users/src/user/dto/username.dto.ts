import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { letterAcentNumber } from "src/common/enums/regexp.constants";

export class UsernameDto {

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(letterAcentNumber)
    readonly username: string;
}