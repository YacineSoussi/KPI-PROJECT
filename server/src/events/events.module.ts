import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { eventProviders } from './events.provider';
import { EventsController } from './events.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, AuthenticationModule, UsersModule],
  providers: [...eventProviders, EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
