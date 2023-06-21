import { SessionSchema } from './schema/session.model';
import { Connection } from 'mongoose';

export const sessionProviders = [
  {
    provide: 'SESSION_MODEL',
    useFactory: (connection: Connection) => connection.model('Session', SessionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
