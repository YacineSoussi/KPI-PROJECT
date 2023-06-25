import { Connection } from 'mongoose';
import { HeatmapSchema } from '../aggregate/schema/heatmap.model';

export const heatmapProviders = [
  {
    provide: 'HEATMAP_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Heatmap', HeatmapSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
