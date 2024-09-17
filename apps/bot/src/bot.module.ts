import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
// import { BotUpdate } from './bot.update';
import {
  schemaConfig,
  telegramConfig,
  rmqConfig,
  RmqModule,
} from '@app/common';
import { Services } from '@app/common';
import { BotController } from './bot.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [telegramConfig, rmqConfig],
      isGlobal: true,
    }),
    RmqModule.register(Services.EventStore),
    RmqModule.register(Services.GraphStore),
    RmqModule.register(Services.TGQuestionService),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule { }
