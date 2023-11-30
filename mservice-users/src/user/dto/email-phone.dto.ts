import { IsEmail, IsNumber, IsOptional, Max, Min } from "class-validator";

export class EmailOrPhoneDto {

    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(999999999999)
    readonly phone?: number;
}