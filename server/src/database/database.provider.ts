import * as mongoose from 'mongoose';

interface ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  authSource: string;
  dbName: string;
}

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        process.env.MONGO_URL
      ),
  },
];



mongoose.set('strictQuery', false);
