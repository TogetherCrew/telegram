import { IgnoreEvent, Services, UpdateEvent } from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { API_CONSTANTS, Bot, RawApi } from 'grammy';
import { Other } from 'grammy/out/core/api';
import { Message } from 'grammy/types';

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

    this.bot.command('start', async (ctx) => {
      await ctx.reply(
        '<b>Welcome!</b>\n\n<u><b>Get Started</b></u>\n\nTo get you up and running, there are two simple steps:\n\n<b>1. Add me to your group or channel</b>\n\nTo add me to your group or channel, simply tap on my username (at the top) and select <i>"Add to Group or Channel"</i>.\n\nSelect the group or channel you want.\n\nI will need <b>Admin Rights</b>, but you can disable all additional privileges.\n\n<b>2. Verify me on <a href="https://app.togethercrew.com">app.togethercrew.com</a></b>\n\nHead over to <a href="https://app.togethercrew.com">https://app.togethercrew.com</a>.\n\nIn your community settings, add a Telegram platform.\n\nCopy the verify command into your group and send it.\n\nI will take care of the rest.',
        { parse_mode: 'HTML' },
      );
    });

    this.bot.command('verify', async (ctx) => {
      await ctx.reply('[Coming soon] This will blow your mind.');
    });

    Object.values(IgnoreEvent).map((event) => {
      this.bot.on(event, () => {
        this.logger.warn(`Ignoring ${event} event.`);
      });
    });

    Object.values(UpdateEvent).map((event) => {
      this.bot.on(event, (ctx) => {
        this.logger.log(`Received ${event} from ${ctx.chat.id}`);

        try {
          this.eventClient.emit(event, ctx);
          this.graphClient.emit(event, ctx);
          if (
            event != UpdateEvent.CHAT_MEMBER &&
            !ctx.update.message.from.is_bot
          ) {
            this.tgQuestionClient.emit(event, ctx);
          }
        } catch (error) {
          this.logger.error(error);
        }

        return;
      });
    });

    this.bot.api.setMyCommands([
      { command: 'start', description: 'Get started with the TogetherCrewBot' },
      { command: 'verify', description: 'Verify your group.' },
    ]);
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
