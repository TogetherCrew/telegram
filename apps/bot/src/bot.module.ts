import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { BotUpdate } from './bot.update';
import {
  schemaConfig,
  telegramConfig,
  rmqConfig,
  RmqModule,
} from '@app/common';
import { Services } from '@app/common';
import { BotController } from './bot.controller';
import { TemporalModule } from 'nestjs-temporal';
import { temporalConfig } from '@app/common/config/temporal.config';
import { Connection } from '@temporalio/client';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [telegramConfig, rmqConfig, temporalConfig],
      isGlobal: true,
    }),
    RmqModule.register(Services.EventStore),
    RmqModule.register(Services.GraphStore),
    RmqModule.register(Services.TGQuestionService),
    TemporalModule.registerClientAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get('temporal.uri');
        console.log('uri', uri);
        const connection = await Connection.connect({
          address: uri,
        });
        return { connection };
      },
    }),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
