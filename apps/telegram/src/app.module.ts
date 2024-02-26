import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import baseConfig from './config/base.config';
import telegramConfig from './config/telegram.config';
import validationSchema from './config/configs.schema';
import rabbitmqConfig from './config/rabbitmq.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
      load: [baseConfig, telegramConfig, rabbitmqConfig],
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
