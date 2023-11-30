import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { IAWS_S3 } from './interfaces/aws-s3.interface';
import { Response } from 'express';

@Injectable()
export class AwsService {

    public logger = new Logger('AWS Service');
    private awsConfig: IAWS_S3;
    private s3: S3;

    constructor( 
        private readonly configService: ConfigService 
    ) {
        this.awsConfig = this.configService.get<IAWS_S3>('aws');
        this.s3 = new S3( this.awsConfig );
    }

    async s3UploadFile( file: Express.Multer.File, fileName: string ) {
        try {
            return await this.s3.upload({
                Bucket: this.awsConfig.bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            }).promise();

        } catch ( error ) { 
            this.logger.error( error );
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }

    async s3GetFile( imageName: string, res: Response ) {
        try {
            const data = await this.s3.getObject({ 
                Bucket: this.awsConfig.bucketName, 
                Key: imageName
            }).promise();
            
            
            res.contentType( data.ContentType );
            return res.send( data.Body );

        } catch ( error ) {
            if ( error.statusCode === 404 ) 
                throw new NotFoundException(`image ${ imageName } don't exist`);
            
            this.logger.error( error );
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }

}
