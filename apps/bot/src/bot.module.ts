import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { schemaConfig, telegramConfig, rmqConfig } from '@app/common';
import { BotController } from './bot.controller';
import { TemporalModule } from 'nestjs-temporal';
import { temporalConfig } from '@app/common/config/temporal.config';
import { Connection } from '@temporalio/client';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [telegramConfig, rmqConfig, temporalConfig],
      isGlobal: true,
    }),
    RabbitMQModule,
    TemporalModule.registerClientAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get('temporal.uri');
        console.log('uri', uri);
        let connection: Connection;
        try {
          connection = await Connection.connect({
            address: uri,
          });
        } catch (error) {
          console.error('Failed to connect to Temporal:', error);
          throw error;
        }
        return { connection };
      },
    }),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule { }
