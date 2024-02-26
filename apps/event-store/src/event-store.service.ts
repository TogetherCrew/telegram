import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createEvent(
    ts: number,
    chat_id: number,
    event_type: string,
    event_data: any,
  ): Promise<Event> {
    const dynamicModel = this.connection.model(
      `${chat_id}`,
      this.eventModel.schema,
    );
    const createdEvent = new dynamicModel({
      ts,
      event_type,
      event_data,
    });
    return createdEvent.save();
  }
}
