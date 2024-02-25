import { NestFactory } from '@nestjs/core';
import { EventProcessorModule } from './event-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(EventProcessorModule);
  await app.listen(3000);
}
bootstrap();
