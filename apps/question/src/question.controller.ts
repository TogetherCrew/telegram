import { Controller, Inject, Logger } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { Services, TelegramAction, UpdateEvent } from '@app/common';
import { Context } from 'grammy';
import { ReplyParameters } from 'grammy/types';
import { UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';

@Controller()
@UseInterceptors(EventsInterceptor)
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);
  constructor(
    private readonly questionService: QuestionService,
    @Inject(Services.TelegramBot.name)
    private readonly telegramClient: ClientProxy,
  ) { }

  @MessagePattern(UpdateEvent.MESSAGE)
  async message(@Payload() ctx: Context): Promise<void> {
    const {
      message_id,
      text: msg,
      chat: { id: chat_id },
    } = ctx.update?.message;
    this.logger.log(`Received message ${message_id} from ${chat_id}`);

    const {
      data: { label, score },
    } = await this.questionService.test(msg);

    const text = `${label}: ${score}`;

    const reply_parameters: ReplyParameters = {
      message_id,
    };

    const data = {
      chat_id,
      text,
      other: {
        reply_parameters,
      },
    };

    this.telegramClient.emit(TelegramAction.SEND_MESSAGE, data);
    this.logger.log(`Emitted reponse to message ${message_id} from ${chat_id}`);
  }
}
