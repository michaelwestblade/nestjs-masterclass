import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  private readonly apiVersion: string;

  constructor(private readonly configService: ConfigService) {
    this.apiVersion = this.configService.get('apiVersion') as string;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return { data, apiVersion: this.apiVersion };
      }),
    );
  }
}
