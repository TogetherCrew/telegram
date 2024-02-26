import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import telegrafConfig from './config/telegraf.config';
import { BotUpdate } from './bot.update';
import { allowedUpdates } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule.forFeature(telegrafConfig)],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAF_TOKEN'),
        launchOptions: {
          allowedUpdates,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
