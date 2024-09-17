import { NestFactory } from '@nestjs/core';
import { QuestionModule } from './question.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(QuestionModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(
    rmqService.getOptions(Services.TGQuestionService.queue),
  );
  await app.startAllMicroservices();
}
bootstrap();
