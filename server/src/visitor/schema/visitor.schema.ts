import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Visitor extends Document {
  
  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop()
  country: string;

  @Prop()
  page: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
