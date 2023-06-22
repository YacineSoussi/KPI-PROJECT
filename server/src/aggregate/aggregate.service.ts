import { Event } from './schema/event.model';
import { Graph } from './schema/graph.model';
import { Session } from './schema/session.model';
import { Model } from 'mongoose';
import { Inject } from '@nestjs/common';

export class AggregateService {
  constructor(
    @Inject('EVENT_MODEL') private eventModel: Model<Event>,
    @Inject('GRAPH_MODEL') private graphModel: Model<Graph>,
    @Inject('SESSION_MODEL') private sessionModel: Model<Session>,
  ) {}

  async generateDynamicAggregate(
    metric: string,
    dimension: string,
    timePeriod: string,
    type: string,
    tag?: string,
  ): Promise<any[]> {
    let chartData = {
      type: type,
      data: {
        labels: [],
        datasets: [],
      },
    };
    let aggregate = [];

    switch (metric) {
      case 'bounceRate':
        aggregate = await this.calculateBounceRateAggregate(timePeriod);
        chartData.data.labels = ['Taux de rebond'];
        chartData.data.datasets.push({
          label: 'Taux de rebond',
          data: [aggregate.length],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        });
        break;

      case 'averageSessionDuration':
        aggregate = await this.calculateAverageSessionDurationAggregate(
          timePeriod,
        );
        chartData.data.labels = ['Durée moyenne de session'];
        chartData.data.datasets.push({
          label: 'Durée moyenne de session',
          data: [aggregate[0]?.averageSessionDuration || 0],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        });
        break;

      case 'pageViews':
        aggregate = await this.calculatePageViewsAggregate(timePeriod);
        chartData.data.labels = ['Nombre de pages vues'];
        chartData.data.datasets.push({
          label: 'Nombre de pages vues',
          data: [aggregate[0]?.totalPageViews || 0],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        });
        break;

      case 'clickRate':
        if (tag) {
          aggregate = await this.calculateClickRateByTagAggregate(
            tag,
            timePeriod,
          );

          if (timePeriod === 'day') {
            const { labels, data } = this.getLabelsAndDataByHour(aggregate);

            chartData.data.labels = labels;
            chartData.data.datasets.push({
              label: 'Nombre de clics',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            });
          } else {
            chartData.data.labels =
              type === 'pie'
                ? aggregate.map((item: any) => item.period)
                : this.getLabels(timePeriod);
            chartData.data.datasets.push({
              label: timePeriod === 'day' ? 'Nombre de clics' : 'Taux de clics',
              data: aggregate.map((item: any) => item.clickRate),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            });
          }
        } else {
          aggregate = await this.calculateGlobalClickRateAggregate(timePeriod);
          chartData.data.labels = ['Taux de clics global'];
          chartData.data.datasets.push({
            label: 'Taux de clics global',
            data: [aggregate[0]?.totalSessions || 0],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          });
        }
        break;

      case 'session':
        aggregate = await this.calculateSessionAggregate(timePeriod);
        chartData.data.labels = aggregate.map((item: any) => item._id);
        chartData.data.datasets.push({
          label: 'Nombre de sessions',
          data: aggregate.map((item: any) => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        });
        break;
    }

    return [chartData];
  }

  //  Taux de rebond
  private async calculateBounceRateAggregate(timePeriod?: string) {
    const aggregate = await this.eventModel.aggregate([
      // Étape d'agrégation pour compter les pageViews par session
      {
        $match: {
          type: 'pageView', // Filtrer uniquement les événements de type "pageView"
        },
      },
      {
        $group: {
          _id: '$sessionId',
          pageCount: { $sum: 1 }, // Compter le nombre de pageViews dans chaque session
        },
      },
      // Étape d'agrégation pour filtrer les sessions avec une seule pageView (taux de rebond)
      {
        $match: {
          pageCount: 1,
        },
      },
      // Ajoutez d'autres étapes d'agrégation au besoin
      { $match: this.getTimePeriodMatch(timePeriod) },
      // Autres étapes d'agrégation
    ]);

    return aggregate;
  }

  // Durée moyenne de la session
  private async calculateAverageSessionDurationAggregate(timePeriod?: string) {
    const aggregate = await this.sessionModel.aggregate([
      // Étape d'agrégation pour calculer la durée moyenne de session avec la période de temps
      {
        $group: {
          _id: null,
          averageSessionDuration: { $avg: '$duration' },
        },
      },
      // Ajoutez d'autres étapes d'agrégation au besoin
      { $match: this.getTimePeriodMatch(timePeriod) },
      // Autres étapes d'agrégation
    ]);

    return aggregate;
  }

  // Nombre de pages vues
  private async calculatePageViewsAggregate(timePeriod?: string) {
    const aggregate = await this.sessionModel.aggregate([
      {
        $group: {
          _id: null,
          totalPageViews: { $sum: '$pageViews' },
        },
      },
      { $match: this.getTimePeriodMatch(timePeriod) },
    ]);

    return aggregate;
  }

  // Taux de clics par tag
  private async calculateClickRateByTagAggregate(
    tag: string,
    timePeriod?: string,
  ): Promise<{ period: string; clickRate: number; timePeriod: string }[]> {
    const dateFormat = this.getDateFormat(timePeriod);
    const labels = this.getLabels(timePeriod);

    const aggregate = await this.eventModel.aggregate([
      { $match: { type: 'click', tag } },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(aggregate, 'aggregate');
    const result = aggregate.map((item: any, index: number) => ({
      period: item._id,
      clickRate: item.count,
      timePeriod,
    }));

    console.log(result, 'result');
    return result;
  }

  // Taux de clics global
  private async calculateGlobalClickRateAggregate(timePeriod?: string) {
    const aggregate = await this.eventModel.aggregate([
      // Étape d'agrégation pour compter le nombre total de clics
      {
        $match: {
          type: 'click',
          ...this.getTimePeriodMatch(timePeriod),
        },
      },
      // Étape d'agrégation pour compter le nombre total de sessions avec clics
      {
        $group: {
          _id: '$sessionId',
          count: { $sum: 1 },
        },
      },
      // Étape d'agrégation pour compter le nombre total de sessions avec clics
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
        },
      },
      // Autres étapes d'agrégation au besoin
    ]);

    return aggregate;
  }

  // Nombre de sessions
  private async calculateSessionAggregate(timePeriod?: string) {
    let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

    if (timePeriod === 'month') {
      groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    } else if (timePeriod === 'year') {
      groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
    }

    const aggregate = await this.sessionModel.aggregate([
      {
        $match: this.getTimePeriodMatch(timePeriod),
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
    ]);

    return aggregate;
  }

  private getTimePeriodMatch(timePeriod?: string) {
    let matchCondition = {};

    if (timePeriod === 'day') {
      matchCondition = {
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      };
    } else if (timePeriod === 'week') {
      matchCondition = {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      };
    } else if (timePeriod === 'month') {
      matchCondition = {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      };
    }

    return matchCondition;
  }

  private getDateFormat(timePeriod?: string) {
    let dateFormat: string;

    if (timePeriod === 'day') {
      dateFormat = '%d/%m/%Y %H:%M';
    } else if (timePeriod === 'month') {
      dateFormat = '%m/%Y';
    } else if (timePeriod === 'week') {
      dateFormat = '%d/%m';
    }

    return dateFormat;
  }

  private getLabels(timePeriod: string): string[] {
    if (timePeriod === 'day') {
      return [
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '00:00',
      ];
    } else if (timePeriod === 'month') {
      return [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
    } else if (timePeriod === 'week') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      throw new Error('Invalid timePeriod');
    }
  }

  /**
   * | [
  { _id: '20/05/2023 22:59', count: 1 },
{ _id: '22/06/2023 20:42', count: 3 },
{ _id: '21/05/2023 16:36', count: 1 },
k{ _id: '21/05/2023 15:16', count: 1 },
{ _id: '20/05/2023 23:02', count: 2 }
] aggregate
   * @param aggregate 
   * @returns 
   */
  private getLabelsAndDataByHour(aggregate: any[]): {
    labels: string[];
    data: number[];
  } {
    const labels = this.getLabels('day');
    const data = labels.map((label) => {
      const item = aggregate.find((item) => {
        return item.period.split(' ')[1].split(':')[0] === label.split(':')[0];
      });
      console.log(item, 'ITEM');
      return item ? item.clickRate : 0;
    });
    console.log(data, 'DATA');
    return { labels, data };
  }
}
