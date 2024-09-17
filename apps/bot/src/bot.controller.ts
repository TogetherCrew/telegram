import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BotService } from './bot.service';
import { TelegramAction } from '@app/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';

interface MessagePayload {
  chat_id: number | string;
  text: string;
  other: any;
}

@Controller()
@UseInterceptors(EventsInterceptor)
export class BotController {
  private readonly logger = new Logger(BotController.name);
  constructor(private readonly botService: BotService) { }

  @MessagePattern(TelegramAction.SEND_MESSAGE)
  async sendMessage(@Payload() payload: MessagePayload): Promise<void> {
    const { chat_id, text, other } = payload;
    await this.botService.sendMessage(chat_id, text, other);
    return;
  }
}
