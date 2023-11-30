import { IsBoolean, IsOptional } from "class-validator";
import { TransformToBoolean } from "src/common/decorators/transform-to-boolean.decorator";
import { TransformToQueryType } from "src/common/decorators/transform-to-query-type.regex.decorator";
import { TransformToSubcategoryTags } from "src/common/decorators/transform-to-subcategory-tags.regex.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class UserQueryParamsDto extends PaginationDto {

    @IsOptional()
    @TransformToQueryType()
    readonly email?: RegExp;

    @IsOptional()
    readonly phone?: number;

    @IsOptional()
    @TransformToQueryType()
    readonly username?: RegExp;

    @IsOptional()
    @TransformToQueryType()
    readonly name?: RegExp;

    @IsOptional()
    @TransformToQueryType()
    readonly surname?: RegExp;

    @IsOptional()
    @TransformToSubcategoryTags('all_match')
    readonly roles?: string[];

    @IsOptional()
    @TransformToBoolean()
    @IsBoolean()
    readonly online?: boolean;
}