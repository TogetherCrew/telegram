import { Module } from '@nestjs/common';
import { EventStoreController } from './event-store.controller';
import { EventStoreService } from './event-store.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { schemaConfig, rmqConfig, RmqModule, mongoConfig } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from './schemas/event.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, mongoConfig],
      isGlobal: true,
    }),
    RmqModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongoConfig)],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventStoreController],
  providers: [EventStoreService],
})
export class EventStoreModule {}
