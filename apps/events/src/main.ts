import { NestFactory } from '@nestjs/core';
import { EventsModule } from './events.module';
import { Queues, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Queues.Event));
  await app.startAllMicroservices();
}
bootstrap();
