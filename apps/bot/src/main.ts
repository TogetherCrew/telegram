import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';
// import { ConfigService } from '@nestjs/config';
// import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BotModule);
  app.listen();
  // const app = await NestFactory.create(BotModule);
  // const configService = app.get(ConfigService);

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [configService.get<string>('rmq.uri')],
  //     queue: 'bot_queue',
  //   },
  // });

  // await app.listen(3000);
}
bootstrap();
