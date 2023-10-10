import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request, Response } from 'express';
import { CommonStatusMsg } from '../common';

@Injectable()
export class HttpResponeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: any) => {
        // response.header('Cache-Control', 'no-cache,no-store,must-revalidate');
        if (data?.response instanceof Buffer) {
          response.header('Content-Type', 'application/json');
          return data.response;
        }
        if (data?.code) {
          return data;
        }
        return {
          // success: true,
          code: HttpStatus.OK,
          data,
          msg: CommonStatusMsg.DEFAULT_SUCCESS_MESSAGE,
        };
      }),
    );
  }
}
