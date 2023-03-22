import * as mongoose from 'mongoose';
import { VisitorSchema } from './visitor.schema';
import { VisitorInterface } from '../visitor.interface';

export class Visitor extends Document implements VisitorInterface {
  date: Date;
  country: string;
  page: string;
} 

export const VisitorModel = mongoose.model<Visitor>('Visitor', VisitorSchema); 
