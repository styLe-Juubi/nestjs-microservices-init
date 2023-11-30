import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseQueryTypes implements PipeTransform {
  transform(value: object, metadata: ArgumentMetadata) {
    
    for ( let p in value ) {
      if ( value[p].type === 'regex-contains') {
        value[p] = new RegExp( value[p].value.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
      }

      if ( value[p].type === 'regex-exact') {
        value[p] = new RegExp(["^", value[p].value.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "$"].join(""), "i");
      }

      if ( value[p].type === 'string-arr-regext-exact' ) {
        let subcategories: RegExp[] = [];
        value[p].value.map(( subcategory: any ) => {
          subcategories.push( new RegExp(["^", subcategory.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "$"].join(""), "i") );
        });

        value[p] = { [value[p].operator]: subcategories };
      }
    }
    
    return value;
  }
}
