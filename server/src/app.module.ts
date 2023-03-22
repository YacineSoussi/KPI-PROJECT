import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KpiModule } from './kpi/kpi.module';
import { DatabaseModule } from './database/database.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [KpiModule, DatabaseModule, VisitorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
