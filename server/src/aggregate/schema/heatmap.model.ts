import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeatmapDocument = Heatmap & Document;

@Schema()
export class Heatmap {
  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  visitorId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, type: Object })
  pageSize: { x: number; y: number };

  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;
}

export const HeatmapSchema = SchemaFactory.createForClass(Heatmap);
