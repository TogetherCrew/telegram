import { Controller, Logger } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';
import { BotService } from './bot.service';
// import { TelegramAction } from '@app/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { Event } from '@togethercrew.dev/tc-messagebroker';
import { Context } from 'grammy';

interface Payload {
  event: string;
  date: Date;
  content: {
    communityId: string;
    route: {
      source: string;
      destination: object;
    };
    question: {
      message: string;
      filters: any;
    };
    response: {
      message: string;
    };
    metadata: {
      ctx: Context;
    };
  };
}

@Controller()
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

  async sendMessage(payload: Payload): Promise<void> {
    console.log('Payload', payload);

    const ctx: Context = payload.content.metadata.ctx;
    console.log('ctx', ctx);
    const message: string = payload.content.response.message;

    await this.botService.sendMessage(ctx.message.chat.id, message, {
      reply_parameters: {
        message_id: ctx.message.message_id,
      },
    });
    return;
  }
}
