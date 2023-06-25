import { HeatmapDto } from './heatmap.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HeatmapService } from './heatmap.service';
import { Heatmap } from 'src/aggregate/schema/heatmap.model';
import { AuthenticationRequired } from 'src/authentication/authentication.decorator';
import { ApiKeyInterceptor } from 'src/users/users.interceptor';

@Controller('heatmap')
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @UseInterceptors(ApiKeyInterceptor)
  @AuthenticationRequired()
  @Get()
  async getHeatmap(@Req() req: any): Promise<Heatmap[]> {
    return this.heatmapService.findAll(req.apiKey);
  }

  @Post()
  async createHeatmap(
    @Body(new ValidationPipe()) createHeatmpDto: HeatmapDto,
  ): Promise<Heatmap> {
    return this.heatmapService.createHeatmap(createHeatmpDto);
  }
}
