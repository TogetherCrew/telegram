// src/rabbitmq/rabbitmq.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RabbitMQ, { Queue } from '@togethercrew.dev/tc-messagebroker';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly rabbitMQ = RabbitMQ;
  private readonly url: string;
  private readonly queue: Queue;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('rmq.uri');
    this.queue = Queue.TELEGRAM;
  }

  async onModuleInit() {
    await this.connect(this.url, this.queue);
  }

  async onModuleDestroy() {}

  async connect(url: string, queue: string) {
    try {
      await this.rabbitMQ.connect(url, queue);
      this.logger.log(`RabbitMQ connected`);
    } catch (err) {
      this.logger.error(err, `Failed to connect to RabbitMQ`);
    }
  }

  disconnect() {}

  publish(queue: Queue, event: string, content: any) {
    this.rabbitMQ.publish(queue, event, content);
  }

  onEvent(event: string, handler: (msg: any) => void) {
    this.rabbitMQ.onEvent(event, handler);
  }
}
