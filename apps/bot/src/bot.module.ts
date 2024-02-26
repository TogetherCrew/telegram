import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { allowedUpdates } from './constants';
import {
  schemaConfig,
  telegrafConfig,
  rmqConfig,
  RmqModule,
} from '@app/common';
import { Queues, Services } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [telegrafConfig, rmqConfig],
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule.forFeature(telegrafConfig)],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('telegraf.token'),
        launchOptions: {
          allowedUpdates,
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule.register({
      name: Services.Event,
      queue: Queues.Event,
    }),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
