import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

const error400 = ( message: object[] ) => {
    return {
        statusCode: 400,
        message,
        error: "Bad Request",
    };
}

/**
 * * This is a decorator to use in DTOs
 * @param validationOptions 
 * @returns true or the bad request
 */
export function UserCreateValidation( validationOptions?: ValidationOptions ) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'userCreateValidation',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
            
            let userProps: any = { ...args.object };
            switch ( true ) {
                case value === 'email':
                    if ( !userProps.email )
                        throw new BadRequestException( 
                            error400([{
                                property: `signup_type: ${value}`,
                                message: 'email must be sent',
                            }])
                        );
                    if ( userProps.phone || userProps.country_code )
                        throw new BadRequestException(
                            error400([{
                                property: ( userProps.phone ) ? 'phone' : 'country_code',
                                message: 'should not exist'
                            }])
                        );

                    break;

                case value === 'phone':
                    if ( !userProps.phone || !userProps.country_code )
                        throw new BadRequestException(
                            error400([{
                                property: `signup_type: ${ value }`,
                                message: `${( !userProps.phone ) ? `phone` : `country_code` } must be sent`,
                            }])
                        );
                    if ( userProps.email )
                        throw new BadRequestException(
                            error400([{
                                property: [userProps.email],
                                message: 'should not exist'
                            }])
                        );

                    break;

                default: return true;
            }

            return true;
        },
      },
    });
  };
}