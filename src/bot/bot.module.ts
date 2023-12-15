import { Module } from '@nestjs/common';
import { TelegramBotGateway } from './bot.gateway';
import { BotService } from './bot.service';

@Module({
  providers: [TelegramBotGateway, BotService],
})
export class BotModule {}
