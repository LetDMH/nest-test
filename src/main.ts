import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './shared/filters';
import { HttpResponeInterceptor } from './shared/interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static',
  });
  // 全局错误处理过滤
  app.useGlobalFilters(new GlobalExceptionFilter());
  // 全局响应拦截
  app.useGlobalInterceptors(new HttpResponeInterceptor());
  await app.listen(3000);
}
bootstrap();
