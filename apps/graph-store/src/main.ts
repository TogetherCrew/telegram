import { NestFactory } from '@nestjs/core';
import { GraphStoreModule } from './graph-store.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(GraphStoreModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.GraphStore.queue));
  await app.startAllMicroservices();
}
bootstrap();
