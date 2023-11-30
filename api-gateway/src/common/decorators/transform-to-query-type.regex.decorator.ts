import { Transform } from 'class-transformer';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { errorMessage400 } from '../constants/error.constants';


/**
 * * This is a decorator to use in DTOs
 * @param type is a string that can be 'regex-contains' or 'regex-exact'
 * @returns a RegExp
 */
const TransformToQueryType = ( type: string = 'regex-contains' ) => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    }
  );
  const toClass = ( target: any, key: string ) => {
    return Transform(
      ({ obj }) => {
        return valueToRegex( obj[key], key, type );
      },
      {
        toClassOnly: true,
      }
    )(target, key);
  };
  return function ( target: any, key: string ) {
    toPlain( target, key );
    toClass( target, key );
  };
};

const valueToRegex = ( value: any, key: string, type: string ) => {
  
  if ( !value || value.trim() === '' )
    throw new BadRequestException( errorMessage400([{
      property: key,
      message: `must be longer than or equal to 1 characters`,
    }]));
  if ( value && value.trim().length > 200 ) 
    throw new BadRequestException( errorMessage400([{
      property: key,
      message: `must be shorter than or equal to 200 characters`,
    }]));

  if ( type === 'regex-contains' ) {
    return {
      value: value.trim(),
      type: 'regex-contains',
      pattern: "/[-[\]{}()*+?.,\\^$|#\s]/g",
    }
  }

  if ( type === 'regex-exact' ) {
    return {
      value: value.trim(),
      type: 'regex-exact',
      pattern: "/[-[\]{}()*+?.,\\^$|#\s]/g",
    }
  }

  throw new InternalServerErrorException(`type option argument of decorator should be "regex-contains or regex-exact"`);
};

export { TransformToQueryType };