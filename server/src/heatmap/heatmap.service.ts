import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { HeatmapDocument } from 'src/aggregate/schema/heatmap.model';
import { HeatmapDto } from './heatmap.dto';

@Injectable()
export class HeatmapService {
  constructor(
    @Inject('HEATMAP_MODEL')
    private readonly heatmapModel: Model<HeatmapDocument>,
  ) {}

  async createHeatmap(heatmap: HeatmapDto): Promise<HeatmapDocument> {
    const createdHeatmap = new this.heatmapModel(heatmap);
    return createdHeatmap.save();
  }

  async findAll(apiKey: string): Promise<HeatmapDocument[]> {
    return this.heatmapModel.find({ apiKey: apiKey }).exec();
  }

  async findHeatmapByApiKey(apiKey: string): Promise<HeatmapDocument[]> {
    return this.heatmapModel.find({ apiKey }).exec();
  }

  async findHeatmapBySessionId(sessionId: string): Promise<HeatmapDocument[]> {
    return this.heatmapModel.find({ sessionId }).exec();
  }

  async findHeatmapByVisitorId(visitorId: string): Promise<HeatmapDocument[]> {
    return this.heatmapModel.find({ visitorId }).exec();
  }
}
