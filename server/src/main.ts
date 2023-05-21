import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // allow cross-origin requests
  app.enableCors();
  

  await app.listen(3000);
}
bootstrap();
