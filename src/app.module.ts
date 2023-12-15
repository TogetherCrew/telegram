import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import baseConfig from './config/base.config';
import neo4jConfig from './config/neo4j.config';
import telegramConfig from './config/telegram.config';
import validationSchema from './config/configs.schema';
import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
      load: [baseConfig, neo4jConfig, telegramConfig],
    }),
    NestjsGrammyModule.forRootAsync({
      botName: 'TogetherCrew',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('telegram.token'),
      }),
      inject: [ConfigService],
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
