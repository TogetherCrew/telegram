import { Injectable, Logger } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';
import { BotService } from './bot.service';
// import { TelegramAction } from '@app/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { Event } from '@togethercrew.dev/tc-messagebroker';

// interface MessagePayload {
//   chat_id: number | string;
//   text: string;
//   other: any;
// }

@Injectable()
export class BotController {
  private readonly logger = new Logger(BotController.name);
  constructor(
    private readonly rabbitmqService: RabbitMQService,
    private readonly botService: BotService,
  ) { }

  onModuleInit() {
    this.registerEvents();
  }

  private registerEvents() {
    this.rabbitmqService.onEvent(
      Event.TELEGRAM.SEND_MESSAGE,
      this.sendMessage.bind(this),
    );
  }

  async sendMessage(payload: Record<string, any>): Promise<void> {
    console.log('Payload', payload);
    // const { chat_id, text, other } = payload;
    // await this.botService.sendMessage(chat_id, text, other);
    return;
  }
}
