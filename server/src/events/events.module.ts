import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { eventProviders } from './events.provider';
import { EventsController } from './events.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...eventProviders, EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
