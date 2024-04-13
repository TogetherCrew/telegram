import { NestFactory } from '@nestjs/core';
import { EventStoreModule } from './event-store.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventStoreModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.EventStore.queue));
  await app.startAllMicroservices();
}
bootstrap();
