import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('assets')
export class FileController {
  
  constructor(
    private readonly fileService: FileService
  ) {}
    
  @Get(':imageName')
  async getFile( @Param('imageName') imageName: string, @Res() res: Response ) {

    return await this.fileService.getFile( imageName, res );
  }

}
