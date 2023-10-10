import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // 获取异常状态码
    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${
          status >= 500
            ? '服务器错误（Service Error）'
            : '客户端错误（Client Error）'
        }`;

    // const nowTime = new Date().getTime();

    const errorResponse = {
      // success: false,
      code: -1,
      data: null,
      msg: message,
    };
    // 将异常记录到logger中
    this.logger.error(
      `${request.method} ${request.url} query:${JSON.stringify(
        request.query,
      )} params:${JSON.stringify(request.params)} body:${JSON.stringify(
        request.body,
      )}`,
      JSON.stringify(exception?.stack),
      'HttpExceptionFilter',
    );
    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
