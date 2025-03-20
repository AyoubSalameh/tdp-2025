import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //this is basically an express app
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
