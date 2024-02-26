import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false }) // strict: false allows storing unstructured data
export class Event extends Document {
  @Prop({ required: true })
  ts: number;

  @Prop({ required: true })
  event_type: string;

  @Prop({ required: true, type: Object })
  event_data: any;
}

export const EventSchema = SchemaFactory.createForClass(Event);
