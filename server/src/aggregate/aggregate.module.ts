import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { eventProviders } from 'src/events/events.provider';
import { graphProviders } from 'src/graphs/graphs.provider';
import { tagProviders } from 'src/tags/tags.provider';
import { visitorProviders } from 'src/visitor/visitor.provider';
import { sessionProviders } from './session.provider';

@Module({
    imports: [DatabaseModule],
    providers: [...eventProviders, ...graphProviders, ...tagProviders, ...visitorProviders, ...sessionProviders],
    controllers: []
})
export class AggregateModule {}
