import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { allowedUpdates } from './constants';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  schemaConfig,
  telegrafConfig,
  rmqConfig,
  RmqModule,
} from '@app/common';
import { EVENT_QUEUE, EVENT_SERVICE } from '@app/common';

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
      name: EVENT_SERVICE,
      queue: EVENT_QUEUE,
    }),
    // ClientsModule.registerAsync({
    //   clients: [
    //     {
    //       name: EVENT_SERVICE,
    //       imports: [ConfigModule.forFeature(rmqConfig)],
    //       useFactory: (configService: ConfigService) => ({
    //         transport: Transport.RMQ,
    //         options: {
    //           urls: [configService.get<string>('rmq.uri')],
    //           queue: EVENT_QUEUE,
    //         },
    //       }),
    //       inject: [ConfigService],
    //     },
    //   ],
    // }),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
