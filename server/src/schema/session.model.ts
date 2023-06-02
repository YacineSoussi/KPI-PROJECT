import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session extends Document {
  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  visitorId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
