import { Connection } from "mongoose";
import { GraphSchema } from "../aggregate/schema/graph.model";

export const graphProviders = [
   { 
    provide: 'GRAPH_MODEL',
    useFactory: (connection: Connection) => connection.model('Graph', GraphSchema),
    inject: ['DATABASE_CONNECTION']
   }
];