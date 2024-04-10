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

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [telegramConfig, rmqConfig],
      isGlobal: true,
    }),
    RmqModule.register(Services.EventStore),
    RmqModule.register(Services.GraphStore),
  ],
  providers: [BotService],
})
export class BotModule {}
