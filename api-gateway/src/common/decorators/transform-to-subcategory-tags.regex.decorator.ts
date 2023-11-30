import { Transform } from 'class-transformer';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';


/**
 * * This is a decorator to use in DTOs
 * @param type is a string that can be 'regex-contains' or 'regex-exact'
 * @returns a RegExp
 */
const TransformToSubcategoryTags = ( match: string = 'one_match' ) => {
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
        return valueToSubcategories( obj, obj[key], key, match );
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

const valueToSubcategories = ( obj: any, value: any, key: string, match: string ) => {
  let subcategory_match = match;
  if ( obj.hasOwnProperty('subcategory_match') )  
    subcategory_match = obj['subcategory_match'];

  if ( subcategory_match === 'one_match' )
    return { 
      operator: '$in',
      value: value.split(','),
      type: 'string-arr-regext-exact'
    };
  
  if ( subcategory_match === 'all_match' ) {
    return { 
      operator: '$all',
      value: value.split(','),
      type: 'string-arr-regext-exact'
    };
  }
};

export { TransformToSubcategoryTags };