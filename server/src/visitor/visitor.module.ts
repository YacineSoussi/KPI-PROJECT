import { Module } from '@nestjs/common';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { DatabaseModule } from 'src/database/database.module';
import { visitorProviders } from './visitor.provider';
import { VisitorAggregationService } from './schema/visitor.aggregate';
// import vkskt

@Module({
  imports: [ DatabaseModule],
  controllers: [VisitorController],
  providers: [VisitorService, ...visitorProviders, VisitorAggregationService],
})
export class VisitorModule {}
