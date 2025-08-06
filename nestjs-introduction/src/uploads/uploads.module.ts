import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProviderService } from './providers/upload-to-aws.provider.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProviderService]
})
export class UploadsModule {}
