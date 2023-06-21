import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag extends Document {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    apiKey: string;

}

export const TagSchema = SchemaFactory.createForClass(Tag);