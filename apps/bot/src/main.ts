import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BotModule);
  app.listen();
}
bootstrap();
