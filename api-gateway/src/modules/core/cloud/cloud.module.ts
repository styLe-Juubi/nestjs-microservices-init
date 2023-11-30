import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { GcpService } from './gcp.service';
import { AzureService } from './azure.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AwsService, GcpService, AzureService],
  exports: [AwsService, GcpService, AzureService],
})
export class CloudModule {}
