import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Event, EventSchema } from './schemas/event.schema';

@Injectable()
export class EventStoreService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createEvent(
    timestamp: number,
    chat_id: number,
    event_type: string,
    event_data: any,
  ): Promise<Event> {
    const dbName = `tg:${chat_id}`;
    const db = this.connection.useDb(dbName, { useCache: true });

    if (!db.models[this.eventModel.collection.name]) {
      db.model(this.eventModel.collection.name, EventSchema);
    }

    const createdEvent = await db
      .model(this.eventModel.collection.name)
      .create({
        timestamp,
        event_type,
        event_data,
      });
    return createdEvent;
  }
}
