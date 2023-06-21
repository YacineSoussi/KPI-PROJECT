import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GraphsService } from './graphs.service';
import { graphProviders } from './graphs.provider';
import { GraphsController } from './graphs.controller';
import { AggregateService } from '../aggregate/aggregate.service';
import { Event } from 'src/aggregate/schema/event.model';
import { eventProviders } from 'src/events/events.provider';
import { EventsModule } from 'src/events/events.module';
import { AggregateModule } from 'src/aggregate/aggregate.module';
import { sessionProviders } from 'src/aggregate/session.provider';

@Module({
    imports: [DatabaseModule, EventsModule, AggregateModule],
    providers: [...eventProviders, ...graphProviders, ...sessionProviders, GraphsService, AggregateService],
    controllers: [GraphsController]
})
export class GraphsModule {}

