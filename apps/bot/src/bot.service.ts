import { IgnoreEvent, Services, UpdateEvent } from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { API_CONSTANTS, Bot, RawApi } from 'grammy';
import { Other } from 'grammy/out/core/api';
import { Message, ReplyParameters } from 'grammy/types';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot;
  private readonly logger = new Logger(BotService.name);

  constructor(
    @Inject(Services.EventStore.name) private readonly eventClient: ClientProxy,
    @Inject(Services.GraphStore.name) private readonly graphClient: ClientProxy,
    @Inject(Services.TGQuestionService.name)
    private readonly tgQuestionClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.bot = new Bot(configService.get<string>('telegram.token'));

    Object.values(IgnoreEvent).map((event) => {
      this.bot.on(event, () => {
        this.logger.warn(`Ignoring ${event} event.`);
      });
    });

    Object.values(UpdateEvent).map((event) => {
      this.bot.on(event, (ctx) => {
        this.logger.log(`Received ${event} from ${ctx.chat.id}`);
        this.eventClient.emit(event, ctx);
        this.graphClient.emit(event, ctx);
        if (!ctx.update.message.from.is_bot) {
          this.tgQuestionClient.emit(event, ctx);
        }
        return;
      });
    });
  }

  async onModuleInit() {
    await this.bot.start({
      allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
    });
  }

  async sendMessage(
    chat_id: number | string,
    text: string,
    other?: Other<RawApi, 'sendMessage', 'text' | 'chat_id'>,
  ): Promise<Message.TextMessage | null> {
    const receipt = await this.bot.api.sendMessage(chat_id, text, other);
    this.logger.log(`Message ${receipt.message_id} sent to ${receipt.chat.id}`);
    return receipt;
  }
}
