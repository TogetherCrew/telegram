import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';

async function bootstrap() {
  // const app = await NestFactory.create(BotModule);
  await NestFactory.create(BotModule);
  // const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions(Services.TelegramBot.queue));
  // await app.startAllMicroservices();
}
bootstrap();
