import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  uploadFile(file: Express.Multer.File) {
    // upload to s3

    // store file url in db

    // return file url
    return Promise.resolve(undefined);
  }
}
