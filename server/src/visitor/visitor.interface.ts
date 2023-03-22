import { Document } from 'mongoose';

export interface VisitorInterface  {
  date: Date;
  country: string;
  page: string;
}
