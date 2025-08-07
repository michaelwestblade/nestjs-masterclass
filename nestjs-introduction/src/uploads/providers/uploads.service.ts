import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UploadEntity } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { FileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadsRepository: Repository<UploadEntity>,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Invalid file type');
    }

    try {
      // upload to s3
      const { Key: name } = await this.uploadToAwsProvider.fileUpload(file);

      // store file url in db
      const uploadFile: UploadFile = {
        name,
        path: `https://${this.configService.get('app.awsCloudfrontUrl')}/${name}`,
        type: FileTypes.IMAGE,
        mimetype: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);

      // return file url
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'error uploading file',
      });
    }
  }
}
