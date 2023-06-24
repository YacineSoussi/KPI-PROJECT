import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GraphDocument = Graph & Document;
@Schema()
export class Graph {
  @Prop({ required: true })
  metric: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  timePeriod: string;

  @Prop()
  apiKey: string;

  @Prop()
  tag?: string;
}

export const GraphSchema = SchemaFactory.createForClass(Graph);
