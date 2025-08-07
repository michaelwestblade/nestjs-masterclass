import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    const secretAccessKey =
      this.configService.get('app.awsSecretAccessKey') || '';
    const accessKeyId = this.configService.get('app.awsAccessKeyId') || '';
    const s3 = new S3({
      credentials: {
        secretAccessKey: secretAccessKey,
        accessKeyId: accessKeyId,
      },
    });
    const bucket = this.configService.get('app.awsBucketName') || '';

    try {
      const uploadResult = await s3
        .upload({
          Bucket: bucket,
          Body: file.buffer,
          Key: this.generateFilename(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult;
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
