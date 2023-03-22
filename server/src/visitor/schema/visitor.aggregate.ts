import { Injectable, Inject } from '@nestjs/common';
import { Visitor } from './visitor.model';
import { Model } from 'mongoose';

@Injectable()
export class VisitorAggregationService {
    constructor(
        @Inject('VISITOR_MODEL') private visitorModel: Model<Visitor>) { }

        async findVisitorPerMonth(country: string): Promise<any[]> {
          const aggregate = [
            { $match: { country } }, // Filtre les visiteurs du pays spécifié
            {
              $group: {
                _id: {
                  month: { $month: '$date' },
                },
                totalVisitors: { $sum: 1 },
                visitors: { $push: '$$ROOT' }, // Ajoute les détails des visiteurs dans un tableau
              },
            },
            {
              $project: {
                _id: 0,
                month: '$_id.month',
                totalVisitors: 1,
                visitors: 1,
              },
            },

          ];
                
          return await this.visitorModel.aggregate(aggregate).exec();
        }


        
}