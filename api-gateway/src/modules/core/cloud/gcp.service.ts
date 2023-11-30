import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { IGCP_Config } from './interfaces/gcloud-config.interface';
import { IGCloud_Enviroments } from './interfaces/gcloud-enviroments.interface';
import { Response } from 'express';

@Injectable()
export class GcpService {

    public logger = new Logger('GCP Service');
    private gcpConfig: IGCP_Config;
    private storage: Storage;
    private bucket: Bucket;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const { cloudStorage, ...config } = this.configService.get<IGCloud_Enviroments>('gcp');
        this.gcpConfig = config;
        this.storage = new Storage( this.gcpConfig );
        this.bucket = this.storage.bucket( cloudStorage.bucketName );
    }

    async storageUploadFile( file: Express.Multer.File, fileName: string ) {
        try {
            return this.bucket
                .file( fileName )
                .save( file.buffer, ( error ) => {
                    if ( !error )
                        return { key: fileName };

                    this.logger.error( error );
                    throw new InternalServerErrorException('Unexpected error, check server logs');
            });
        } catch ( error ) { 
            this.logger.error( error );
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }

    async storageGetFile( imageName: string, res: Response ) {
        try {
            await this.bucket.file( imageName )
                .download()
                .then( async (data) => {
                    res.contentType( 
                        await this.getMimeType( imageName.split('.').pop() ) 
                    );
                    return res.send( data[0] );
            }); 

        } catch ( error ) {
            throw new NotFoundException(`image ${ imageName } don't exist`);
        }
    }

    async getMimeType( type: string ): Promise<string> {
        const mime = {
            html: 'text/html',
            txt: 'text/plain',
            css: 'text/css',
            gif: 'image/gif',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml',
            js: 'application/javascript'
        };

        return mime[type];
    }


}
