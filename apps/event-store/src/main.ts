import { NestFactory } from '@nestjs/core';
import { EventsModule } from './event-store.module';
import { Queues, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Queues.EventStore));
  await app.startAllMicroservices();
}
bootstrap();
