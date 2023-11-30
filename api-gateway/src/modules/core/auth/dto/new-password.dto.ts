import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { upperLowerNumber } from "src/common/enums/regexp.constants";
import { NewPasswordValidation } from "../decorators/new-password.decorator";

export class NewPasswordDto {

    @NewPasswordValidation()
    @IsString()
    @MinLength(5)
    @MaxLength(5)
    readonly code: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    readonly password: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    readonly repeatPassword: string;
}
