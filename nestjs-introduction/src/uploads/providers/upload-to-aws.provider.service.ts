import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadToAwsProviderService {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new AWS.S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('appConfig.awsBucketName') || '',
          Body: file.buffer,
          Key: this.generateFilename(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Location;
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(error, {
        description: 'Could not upload file to aws',
      });
    }
  }

  private generateFilename(file: Express.Multer.File) {
    // extract filename
    const [name] = file.originalname.split('.');

    // remove white space
    name.replace(/\s/g, '').trim();

    const extensionName = path.extname(file.originalname);

    // generate timestamp
    const timestamp = new Date().getTime().toString().trim();

    // return file uuid
    return `${name}-${timestamp}-${uuidv4()}${extensionName}`;
  }
}
