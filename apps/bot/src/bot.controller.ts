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
  ) {}

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
    try {
      const ctx: Context = payload.content.metadata.ctx;
      const reply: string = payload.content.response.message;

      const timestamp = ctx.update.message.date;
      const messageDate = new Date(timestamp * 1000);
      const now = new Date();
      const diff = now.getTime() - messageDate.getTime();
      const diffInMinutes = diff / (1000 * 60);

      if (diffInMinutes > 2) {
        console.log(
          'Skipping message from',
          ctx.update.message.chat.id,
          'because it is older than 2 minutes',
        );
        return;
      }
      await this.botService.sendMessage(ctx.update.message.chat.id, reply, {
        reply_parameters: {
          message_id: ctx.update.message.message_id,
        },
      });
      return;
    } catch (error) {
      console.error(error.message);
    }
  }
}
