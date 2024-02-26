import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import telegrafConfig from './config/telegraf.config';
import { BotUpdate } from './bot.update';
import { allowedUpdates } from './constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import schemaConfig from './config/schema.config';
import rmqConfig from './config/rmq.config';
import { EVENT_QUEUE, EVENT_SERVICE } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
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
    ClientsModule.registerAsync({
      clients: [
        {
          name: EVENT_SERVICE,
          imports: [ConfigModule.forFeature(rmqConfig)],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('rmq.uri')],
              queue: EVENT_QUEUE,
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
