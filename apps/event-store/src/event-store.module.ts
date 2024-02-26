import { Module } from '@nestjs/common';
import { EventsController } from './event-store.controller';
import { EventsService } from './event-store.service';
import { ConfigModule } from '@nestjs/config';
import { schemaConfig, rmqConfig, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './events.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig],
      isGlobal: true,
    }),
    RmqModule,
    MongooseModule.forRoot('mongodb://root:pass@localhost:27017'),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
