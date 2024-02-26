import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotUpdate } from './bot.update';
import {
  schemaConfig,
  telegrafConfig,
  rmqConfig,
  RmqModule,
} from '@app/common';
import { Queues, Services } from '@app/common';
import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { API_CONSTANTS } from 'grammy';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [telegrafConfig, rmqConfig],
      isGlobal: true,
    }),
    RmqModule.register({
      name: Services.EventStore,
      queue: Queues.EventStore,
    }),
    NestjsGrammyModule.forRootAsync({
      imports: [ConfigModule.forFeature(telegrafConfig)],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('telegram.token'),
        pollingOptions: {
          allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
