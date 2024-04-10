import { Services } from '@app/common';
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

    API_CONSTANTS.ALL_UPDATE_TYPES.map((updateType) => {
      this.bot.on(updateType, (ctx) => {
        this.logger.log(updateType, ctx.chat.id);
        this.eventClient.emit(updateType, ctx);
        this.graphClient.emit(updateType, ctx);
      });
    });
  }

  async onModuleInit() {
    await this.bot.start({
      allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
    });
  }
}
