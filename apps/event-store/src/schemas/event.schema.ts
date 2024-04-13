import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ strict: false }) // strict: false allows storing unstructured data
export class Event {
  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  event_type: string;

  @Prop({ required: true, type: Object })
  event_data: any;
}

export const EventSchema = SchemaFactory.createForClass(Event);
