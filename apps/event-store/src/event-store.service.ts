import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Event } from './schemas/event.schema';

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
    this.connection.useDb(dbName);

    const createdEvent = await this.eventModel.create({
      timestamp,
      event_type,
      event_data,
    });
    return createdEvent;
  }
}
