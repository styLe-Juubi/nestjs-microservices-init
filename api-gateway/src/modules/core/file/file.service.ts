import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { IAWS_S3 } from '../cloud/interfaces/aws-s3.interface';
import { Response } from 'express';
import { CLOUD_PLATFORM_TYPES } from 'src/common/enums/cloud-platform-types.enum';
import { AwsService } from '../cloud/aws.service';
import { GcpService } from '../cloud/gcp.service';

@Injectable()
export class FileService {
    

    /**
     * 
     * @variable cloudPlatform is the tecnology to save files in the cloud
     * @variable awsConfig is the Amazon Web Service S3 configuration
     * @S3 is the S3 to instanciate your credentials to use Amazon Web Service
     */
    private logger = new Logger('FileService');
    private cloudPlatform: string = this.configService.get('cloudPlatform');
    
    constructor(
        private readonly configService: ConfigService,
        private readonly gcpService: GcpService,
        private readonly awsService: AwsService,
    ) { }

    /**
     * * Function to upload files sent from the body
     * @param files of the request body in an object 
     * @returns an object with properties that are an string array 
     *          like this obj = { prop1: ['a.jpg','b.jpg'], prop2: ['test.gif'] ...prop n }
     */
    async uploadFiles<T, U>( files: T ): Promise<U> {
        let props = Object.keys(files);
        let arrPromisesPending = await this.getArrayToUpload<T>( props, files );

        let arrPromisesDone = await Promise.all(
            arrPromisesPending.map( async( file: Express.Multer.File ) => {
                return {
                    fieldname: file.fieldname,
                    ...( await this.uploadFileTo( file ) ),
                }
            })
        )

        return await this.getUploadedFiles<U>( arrPromisesDone, props );
    }

    /**
     * * Function to get an array of objects of the files sent from the body
     * * to make a Promise.all() 
     * @param props all properties ( fieldname in the form-data body ) of the files object
     * @param files of the request body in an object 
     * @returns an array of objects that every object is the file that will be uploaded 
     */
    async getArrayToUpload<T>( props: string[], files: T ): Promise<Object[]> {
        let promises: Object[] = [];
        props.map(( prop: string ) => {

            files[prop].map(( file: Express.Multer.File ) =>  {

                promises.push( file );

            });
        })
        return promises;
    }

    /**
     * * Function that upload the file to cloud platform
     * @param file object to upload
     * @param cloudPlatform site where files will be uploaded
     * @returns the response of cloudPlatform
     */
    async uploadFileTo( file: Express.Multer.File ): Promise<any> {
        let type: string = file.originalname.split(".").pop();
        let genericFilename: string = `${ uuid() }-${ moment().format().split('T')[0] }`;

        if ( this.cloudPlatform === CLOUD_PLATFORM_TYPES.AWS )
            return await this.awsService.s3UploadFile( file, `${ genericFilename }.${ type }` );

        if ( this.cloudPlatform === CLOUD_PLATFORM_TYPES.GCP )
            return await this.gcpService.storageUploadFile( file, `${ genericFilename }.${ type }` );
            
        
        this.logger.error('Set .env variable "FILE_UPLOAD_PLATFORM"');
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }


    /**
     * * Function to format the names of the files uploaded to the cloud 
     * * platform and return them in an object with the corresponding
     * * properties and each of these will have an array of strings
     * 
     * @param arrPromisesDone an array of objects that were uploaded
     * @param props that's means fieldnames of the files
     * @returns 
     * ! Example of returns -----------------------------------------------------------
     * ! {
     * !     avatar: ['image1.png','image2.jpg', 'image3.jpeg', 'image4.jpg'],
     * !     background: ['image1.png','image2.jpg', 'image3.jpeg', 'image4.jpg'],
     * ! }
     */
    async getUploadedFiles<T>( arrPromisesDone: Object[], props: string[] ): Promise<T> {
        let uploadedFiles: any = {};
        props.map(( prop: string ) => {

            uploadedFiles[prop] = [];
            arrPromisesDone.map(( file: any ) =>  {

                if ( file.fieldname === prop ) {
                    uploadedFiles[prop].push( file.key );
                }

            });
        });
        return uploadedFiles;
    }

    /**
     * 
     * @param imageName name of the image
     * @param res @Res() to response from Express
     * @returns the image obtained from the cloud platform to client
     */
    async getFile( imageName: string, res: Response ) {

        if ( this.cloudPlatform === CLOUD_PLATFORM_TYPES.AWS )
            return await this.awsService.s3GetFile( imageName, res );

        if ( this.cloudPlatform === CLOUD_PLATFORM_TYPES.GCP )
            return await this.gcpService.storageGetFile( imageName, res );

        this.logger.error('Set .env variable "FILE_UPLOAD_PLATFORM"');
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}   
