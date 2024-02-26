import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ConfigModule } from '@nestjs/config';
import { schemaConfig, rmqConfig, RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig],
      isGlobal: true,
    }),
    RmqModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
