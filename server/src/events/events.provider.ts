import { Connection } from 'mongoose';
import { EventSchema } from '../aggregate/schema/event.model'

export const eventProviders = [
  {
    provide: 'EVENT_MODEL',
    useFactory: (connection: Connection) => connection.model('Event', EventSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
