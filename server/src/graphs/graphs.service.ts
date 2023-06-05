import { Injectable, Inject } from '@nestjs/common';
import { CreateGraphDto, UpdateGraphDto } from './graphs.dto';
import { Model } from 'mongoose';
import { Graph, GraphDocument } from 'src/schema/graph.model';
import { AggregateService } from '../schema/aggregate.service';

@Injectable()
export class GraphsService {
    constructor(
        @Inject('GRAPH_MODEL') private graphModel: Model<GraphDocument>,
        private aggregateService: AggregateService
        ) {}
    
    async createGraph(createGraphDto: CreateGraphDto): Promise<Graph> {
        const createdGraph = new this.graphModel(createGraphDto);
        return createdGraph.save();
    }

    async findAll(): Promise<Graph[]> {
        return this.graphModel.find().exec();
    }

    async generateGraphsAggregate(CreateGraphDto: CreateGraphDto): Promise<any[]>
    {
        const { metric, dimension, timePeriod, tag } = CreateGraphDto;

        return this.aggregateService.generateDynamicAggregate(metric, dimension, timePeriod, tag);
    }

    findOneById(id: string): Promise<Graph> {
        return this.graphModel.findById(id).exec();
    }

    updateOneById(id: string, updateGraphDto: UpdateGraphDto): Promise<Graph> {
        return this.graphModel.findByIdAndUpdate(id, updateGraphDto, { new: true }).exec();
    }

    deleteOneById(id: string): Promise<Graph> {
        return this.graphModel.findByIdAndDelete(id).exec();
    }

}
