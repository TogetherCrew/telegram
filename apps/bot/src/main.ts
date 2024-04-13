import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice(BotModule);
  const app = await NestFactory.create(BotModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.TelegramBot.queue));
  await app.startAllMicroservices();
  app.listen(3000);
}
bootstrap();
