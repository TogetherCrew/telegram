import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const opts: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('rabbitmq.uri')],
      queue: 'telegram_queue',
    },
  };

  app.connectMicroservice(opts);
  const port = configService.get<number>('base.port');
  await app.listen(port, () => {
    Logger.verbose(`Server is running on port ${port}`, 'NestApplication');
  });
}

bootstrap();
