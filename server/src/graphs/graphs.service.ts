import { Injectable, Inject } from '@nestjs/common';
import { CreateGraphDto, UpdateGraphDto } from './graphs.dto';
import { Model } from 'mongoose';
import { Graph, GraphDocument } from 'src/aggregate/schema/graph.model';
import { AggregateService } from '../aggregate/aggregate.service';
import { DeleteResult } from 'typeorm';

@Injectable()
export class GraphsService {
  constructor(
    @Inject('GRAPH_MODEL') private graphModel: Model<GraphDocument>,
    private aggregateService: AggregateService,
  ) {}

  async createGraph(createGraphDto: CreateGraphDto): Promise<Graph> {
    const createdGraph = new this.graphModel(createGraphDto);
    return createdGraph.save();
  }

  async findAll(): Promise<Graph[]> {
    return await this.graphModel.find().exec();
  }

  async generateGraphsAggregate(
    CreateGraphDto: CreateGraphDto,
  ): Promise<any[]> {
    const { metric, dimension, timePeriod, type, tag } = CreateGraphDto;
    return this.aggregateService.generateDynamicAggregate(
      metric,
      dimension,
      timePeriod,
      type,
      tag,
    );
  }

  findOneById(id: string): Promise<Graph> {
    return this.graphModel.findById(id).exec();
  }

  updateOneById(id: string, updateGraphDto: UpdateGraphDto): Promise<Graph> {
    return this.graphModel
      .findByIdAndUpdate(id, updateGraphDto, { new: true })
      .exec();
  }

  deleteOneById(id: string): Promise<Graph> {
    return this.graphModel.findByIdAndDelete(id).exec();
  }

  async deleteAll(): Promise<any> {
    const graphs = await this.graphModel.find().exec();
    graphs.forEach((graph) => {
      graph.remove();
    });
  }
}
