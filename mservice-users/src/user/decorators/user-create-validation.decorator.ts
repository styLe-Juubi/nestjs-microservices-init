import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { errorMessage400 } from 'src/common/constants/error.constants';

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
                        throw new RpcException(
                            new BadRequestException( errorMessage400([{
                                property: `signup_type: ${value}`,
                                message: 'Email must be sent',
                            }]))
                        );
                    if ( userProps.phone || userProps.country_code )
                        throw new RpcException(
                            new BadRequestException( errorMessage400([{
                                property: ( userProps.phone ) ? 'phone' : 'country_code',
                                message: 'Should not exist'
                            }]))
                        );

                    break;

                case value === 'phone':
                    if ( !userProps.phone || !userProps.country_code )
                        throw new RpcException(
                            new BadRequestException( errorMessage400([{
                                property: `signup_type: ${ value }`,
                                message: `${( !userProps.phone ) ? `Phone` : `Country_code` } must be sent`,
                            }]))
                        );    
                    if ( userProps.email )
                        throw new RpcException(
                            new BadRequestException( errorMessage400([{
                                property: [userProps.email],
                                message: 'Should not exist'
                            }]))
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