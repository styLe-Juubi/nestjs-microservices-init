import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength } from "class-validator";
import { letterAcentNumber, upperLowerNumber } from "src/common/enums/regexp.constants";

export class CreateCustomerUserDto {

    /** 
     * ! ---------------------------------------------
     * * the values ​​of the following properties      *
     * * 'uuid' and 'multifactor_auth' are assigned  *
     * * in the method " async createUserDto() "     *
     * ! ---------------------------------------------
     */
    @IsOptional()
    @IsUUID()
    readonly uuid?: string;
    
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(upperLowerNumber, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    readonly password: string;
    
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(letterAcentNumber)
    readonly username: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Matches(letterAcentNumber)
    readonly name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @Matches(letterAcentNumber)
    readonly surname: string;

    @IsNumber()
    @Min(1)
    @Max(10000)
    readonly country_code: number;

    @IsNumber()
    @Min(10000, { message: 'phone must not be less than 5 digits'})
    @Max(100000000000000, { message: 'phone must not be greater than 15 digits'})
    readonly phone: number;
}
