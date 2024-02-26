import { NestFactory } from '@nestjs/core';
import { EventsModule } from './events.module';
import { EVENT_QUEUE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(EVENT_QUEUE));
  await app.startAllMicroservices();
}
bootstrap();
