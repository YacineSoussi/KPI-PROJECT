import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Visitor } from './schema/visitor.model';
import { VisitorAggregationService } from './schema/visitor.aggregate';
import { CreateVisitorDto, UpdateVisitorDto } from './dto/visitor.dto';


@Injectable()
export class VisitorService {
  constructor(
    @Inject('VISITOR_MODEL') private visitorModel: Model<Visitor>,
    private VisitorAggregationService: VisitorAggregationService
    ) {}

    async createVisitor(visitor: CreateVisitorDto): Promise<Visitor> {
    const date = new Date();

    const createdVisitor = new this.visitorModel({
        ...visitor,
        date
    });
    return createdVisitor.save();
    }
    
    async findAllVisitors(): Promise<Visitor[]> {
    return this.visitorModel.find().exec();
    }

    async findVisitorsByPage(page: string): Promise<Visitor[]> {
    return this.visitorModel.find({ page }).exec();
    }

    async findVisitorPerMonth(): Promise<Visitor[]> {

        return this.VisitorAggregationService.findVisitorPerMonth("France");
    }


    async findVisitorsByCountry(country: string): Promise<Visitor[]> {
        return this.visitorModel.find({ country }).exec();
    }

    async updateVisitor (id: string, visitor: UpdateVisitorDto): Promise<Visitor> {
        return this.visitorModel.findByIdAndUpdate(id, visitor, { new: true }).exec();
    }

    async deleteVisitor (id: string): Promise<void> {
        await this.visitorModel.findByIdAndDelete(id).exec();
    }
}
