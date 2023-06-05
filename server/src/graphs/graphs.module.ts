import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GraphsService } from './graphs.service';
import { graphProviders } from './graphs.provider';
import { GraphsController } from './graphs.controller';
import { AggregateService } from '../schema/aggregate.service';

@Module({
    imports: [DatabaseModule],
    providers: [...graphProviders, GraphsService, AggregateService],
    controllers: [GraphsController]
})
export class GraphsModule {}

