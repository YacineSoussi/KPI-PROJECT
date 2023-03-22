import { Connection } from 'mongoose';
import { VisitorSchema } from './schema/visitor.schema';

export const visitorProviders = [
  {
    provide: 'VISITOR_MODEL',
    useFactory: (connection: Connection) => connection.model('Visitor', VisitorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]