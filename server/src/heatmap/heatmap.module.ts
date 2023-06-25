import { Module } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';
import { DatabaseModule } from 'src/database/database.module';
import { heatmapProviders } from './heatmap.provider';
import { HeatmapController } from './heatmap.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [HeatmapService, ...heatmapProviders],
  controllers: [HeatmapController],
})
export class HeatmapModule {}
