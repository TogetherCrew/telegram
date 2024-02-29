import { NestFactory } from '@nestjs/core';
import { GraphStoreModule } from './graph-store.module';
import { RmqService, Queues } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(GraphStoreModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Queues.GraphStore));
  await app.startAllMicroservices();
}
bootstrap();
