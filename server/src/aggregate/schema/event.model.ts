import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  tag?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  visitorId: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  page: string;

  @Prop({ required: false })
  referer: string;

  @Prop({ required: false })
  ip: string;

  @Prop({ required: false })
  browser: string;

  @Prop({ required: false })
  os: string;

  @Prop({ required: false })
  device: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
