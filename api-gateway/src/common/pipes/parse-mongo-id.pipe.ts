import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { errorMessage400 } from '../constants/error.constants';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {

      if( !value.match(/^[0-9a-fA-F]{24}$/) ) 
        throw new BadRequestException( errorMessage400([{
          property: value,
          message: `Is not a valid mongo id`,
        }]));
    
      return value;
  }
}
