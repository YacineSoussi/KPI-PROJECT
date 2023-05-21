import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { VisitorModule } from './visitor/visitor.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/users.entity';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [ConfigModule.forRoot() ,DatabaseModule, VisitorModule, EventsModule, UsersModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: "postgres",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      entities: [User],
      synchronize: true,
      autoLoadEntities: true
    }
  ), AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule  {}
