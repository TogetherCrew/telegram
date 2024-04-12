import { Services, UpdateEvent } from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { API_CONSTANTS, Bot } from 'grammy';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot;
  private readonly logger = new Logger(BotService.name);

  constructor(
    @Inject(Services.EventStore.name) private eventClient: ClientProxy,
    @Inject(Services.GraphStore.name) private graphClient: ClientProxy,
    private configService: ConfigService,
  ) {
    this.bot = new Bot(configService.get<string>('telegram.token'));

    Object.values(UpdateEvent).map((event) => {
      this.bot.on(event, (ctx) => {
        this.logger.log(`Received ${event} from ${ctx.chat.id}`);
        this.eventClient.emit(event, ctx);
        this.graphClient.emit(event, ctx);
      });
    });
  }

  async onModuleInit() {
    await this.bot.start({
      allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
    });
  }
}
