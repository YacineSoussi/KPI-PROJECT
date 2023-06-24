import { ApiKeyInterceptor } from './../users/users.interceptor';
import { Event } from './schema/event.model';
import { Graph } from './schema/graph.model';
import { Session } from './schema/session.model';
import { Model } from 'mongoose';
import { Inject } from '@nestjs/common';
import { cp } from 'fs';

export class AggregateService {
  constructor(
    @Inject('EVENT_MODEL') private eventModel: Model<Event>,
    @Inject('GRAPH_MODEL') private graphModel: Model<Graph>,
    @Inject('SESSION_MODEL') private sessionModel: Model<Session>,
  ) {}

  async generateDynamicAggregate(
    metric: string,
    timePeriod: string,
    type: string,
    apiKey: string,
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
        aggregate = await this.calculateBounceRateAggregate(timePeriod, apiKey);

        const { labelsBounce, dataBounce } =
          this.getLabelsAndDataByTimePeriodByBounceRate(aggregate, timePeriod);

        chartData.data.labels =
          type === 'pie'
            ? aggregate
                .filter((value) => value.bounceRate > 0)
                .map((item: any) => item.period)
            : this.getLabels(timePeriod);

        chartData.data.datasets.push({
          label: 'Taux de rebond',
          data:
            type === 'pie'
              ? dataBounce.filter((item) => {
                  return item !== 0 && item !== undefined;
                })
              : dataBounce,
          backgroundColor:
            type === 'pie'
              ? this.getColors(dataBounce.filter((value: number) => value > 0))
              : this.getRandomColor(),
        });
        break;

      case 'averageSessionDuration':
        aggregate = await this.calculateAverageSessionDurationAggregate(
          timePeriod,
          apiKey,
        );
        chartData.data.labels = ['Durée moyenne de session'];
        chartData.data.datasets.push({
          label: 'Durée moyenne de session',
          data: [aggregate[0]?.averageSessionDuration || 0],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        });
        break;

      case 'pageViews':
        aggregate = await this.calculatePageViewsAggregate(timePeriod, apiKey);

        const { labels, data } = this.getLabelsAndDataByTimePeriodByPage(
          aggregate,
          timePeriod,
        );

        chartData.data.labels =
          type === 'pie'
            ? aggregate.map((item: any) => item.period)
            : this.getLabels(timePeriod);
        chartData.data.datasets.push({
          label: 'Nombre de pages vues',
          data:
            type === 'pie'
              ? data.filter((item) => {
                  return item !== 0 && item !== undefined;
                })
              : data,
          backgroundColor:
            type === 'pie'
              ? this.getColors(data.filter((value: number) => value > 0))
              : this.getRandomColor(),
        });

        break;

      case 'clickRate':
        if (tag) {
          aggregate = await this.calculateClickRateByTagAggregate(
            tag,
            timePeriod,
            apiKey,
          );

          if (timePeriod === 'day') {
            const { labels, data } = this.getLabelsAndDataByHour(aggregate);
            chartData.data.labels =
              type === 'pie'
                ? aggregate
                    .map((item: any) => {
                      const hhMM = item.period.split(' ')[1];
                      return hhMM.split(':')[0] + 'h';
                    })
                    .filter((value: string, index: number, self: string[]) => {
                      return self.indexOf(value) === index;
                    })
                    .sort((a: string, b: string) => {
                      if (a === '00h') {
                        return 1;
                      } else if (b === '00h') {
                        return -1;
                      } else {
                        return (
                          Number(a.split('h')[0]) - Number(b.split('h')[0])
                        );
                      }
                    })
                : labels;

            chartData.data.datasets.push({
              label: tag ? `Nombre de clics pour ${tag} par heure` : '',
              data:
                type === 'pie'
                  ? data.filter((item) => {
                      return item !== 0 && item !== undefined;
                    })
                  : data,
              backgroundColor:
                type === 'pie'
                  ? this.getColors(data.filter((value: number) => value > 0))
                  : this.getRandomColor(),
            });
          }

          if (timePeriod === 'week') {
            const { labels, data } = this.getLabelsAndDataByDay(aggregate);
            chartData.data.labels =
              type === 'pie'
                ? aggregate.map((item: any) => item.period)
                : labels;
            chartData.data.datasets.push({
              label: tag
                ? `Nombre de clics pour ${tag} par semaine`
                : 'Nombre de clics par semaine',
              data:
                type === 'pie'
                  ? data.filter((item) => {
                      return item !== 0 && item !== undefined;
                    })
                  : data,
              backgroundColor:
                type === 'pie'
                  ? this.getColors(data.filter((value: number) => value > 0))
                  : this.getRandomColor(),
            });
          }

          if (timePeriod === 'month') {
            const { labels, data } = this.getLabelsAndDataByMonth(aggregate);

            chartData.data.labels =
              type === 'pie'
                ? aggregate.map((item: any) => item.period)
                : this.getLabels(timePeriod);
            chartData.data.datasets.push({
              label: tag
                ? `Nombre de clics pour ${tag} par mois`
                : 'Nombre de clics par mois',
              data:
                type === 'pie'
                  ? data.filter((item) => {
                      return item !== 0 && item !== undefined;
                    })
                  : data,
              backgroundColor:
                type === 'pie'
                  ? this.getColors(data.filter((value: number) => value > 0))
                  : this.getRandomColor(),
            });
          }
        }
        break;

      // case 'session':
      //   aggregate = await this.calculateSessionAggregate(timePeriod, apiKey);
      //   chartData.data.labels = aggregate.map((item: any) => item._id);
      //   chartData.data.datasets.push({
      //     label: 'Nombre de sessions',
      //     data: aggregate.map((item: any) => item.count),
      //     backgroundColor: 'rgba(75, 192, 192, 0.6)',
      //   });
      //   break;
    }

    return [chartData];
  }

  //  Taux de rebond
  private async calculateBounceRateAggregate(
    timePeriod: string,
    apiKey: string,
  ) {
    const dateFormat = this.getDateFormat(timePeriod);

    const aggregate = await this.eventModel.aggregate([
      {
        $match: {
          type: 'pageView',
          apiKey,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' },
          },
          sessions: { $addToSet: '$sessionId' },
          pageViews: { $sum: 1 },
        },
      },
    ]);

    const bounceRateAggregate = aggregate.map((item: any) => {
      return {
        period: item._id,
        bounceRate: item.pageViews === 1 ? 1 : 0,
      };
    });

    return bounceRateAggregate;
  }

  // Durée moyenne de la session
  private async calculateAverageSessionDurationAggregate(
    timePeriod: string,
    apiKey: string,
  ) {
    const aggregate = await this.sessionModel.aggregate([
      {
        $group: {
          _id: null,
          averageSessionDuration: { $avg: '$duration' },
        },
      },
      { $match: this.getTimePeriodMatch(timePeriod) },
    ]);
    return aggregate;
  }

  // Nombre de pages vues
  private async calculatePageViewsAggregate(
    timePeriod: string,
    apiKey: string,
  ) {
    const dateFormat = this.getDateFormat(timePeriod);
    const aggregate = await this.eventModel.aggregate([
      {
        $match: {
          type: 'pageView',
          apiKey,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' },
          },
          count: { $sum: 1 },
          page: { $first: '$page' },
        },
      },
    ]);

    const result = aggregate.map((item: any, index: number) => ({
      period: item._id,
      pageViews: item.count,
      timePeriod,
      page: item.page,
    }));
    return result;
  }

  private async calculateClickRateByTagAggregate(
    tag: string,
    timePeriod: string,
    apiKey: string,
  ): Promise<{ period: string; clickRate: number; timePeriod: string }[]> {
    const dateFormat = this.getDateFormat(timePeriod);

    const aggregate = await this.eventModel.aggregate([
      { $match: { type: 'click', tag, apiKey } },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = aggregate.map((item: any, index: number) => ({
      period: item._id,
      clickRate: item.count,
      timePeriod,
    }));

    return result;
  }

  // Nombre de sessions
  // private async calculateSessionAggregate(timePeriod: string, apiKey: string) {
  //   let groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

  //   if (timePeriod === 'month') {
  //     groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
  //   } else if (timePeriod === 'year') {
  //     groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
  //   }

  //   const aggregate = await this.sessionModel.aggregate([
  //     {
  //       $match: this.getTimePeriodMatch(timePeriod),
  //     },
  //     {
  //       $group: {
  //         _id: groupBy,
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]);

  //   return aggregate;
  // }

  private getTimePeriodMatch(timePeriod: string) {
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
   * @param aggregate
   * @returns
   */
  private getLabelsAndDataByHour(aggregate: any[]): {
    labels: string[];
    data: number[];
  } {
    const labels = this.getLabels('day');
    const data = labels.map((label) => {
      const items = aggregate.filter((item) => {
        return item.period.split(' ')[1].split(':')[0] === label.split(':')[0];
      });
      const totalClickRate = items.reduce(
        (total, item) => total + item.clickRate,
        0,
      );
      return totalClickRate;
    });

    return { labels, data };
  }
  private getLabelsAndDataByDay(aggregate: any[]): {
    labels: string[];
    data: number[];
  } {
    const labels = this.getLabels('week');
    const data = labels.map((label) => {
      const weekNumber = parseInt(label.split(' ')[1]);
      const item = aggregate.find((item) => {
        const itemWeekNumber = this.getWeekNumberFromDate(item.period);
        return itemWeekNumber === weekNumber;
      });
      return item ? item.clickRate : 0;
    });
    return { labels, data };
  }

  private getLabelsAndDataByMonth(aggregate: any[]): {
    labels: string[];
    data: number[];
  } {
    const labels = this.getLabels('month');
    const data = labels.map((label) => {
      const item = aggregate.find((item) => {
        const month = this.getMonthNumberFromDate(item.period);
        return month === label;
      });
      return item ? item.clickRate : 0;
    });
    return { labels, data };
  }

  private getWeekNumberFromDate(dateString: string): number {
    const [day, month] = dateString.split('/');
    const date = new Date(
      new Date().getFullYear(),
      parseInt(month) - 1,
      parseInt(day),
    );
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.floor(pastDaysOfYear / 7) + 1;

    if (weekNumber > 28) {
      return 4;
    } else if (weekNumber > 21) {
      return 3;
    } else if (weekNumber > 14) {
      return 2;
    } else {
      return 1;
    }
  }

  private getMonthNumberFromDate(dateString: string): string {
    const [month, year] = dateString.split('/');
    const monthString = new Date(
      new Date().getFullYear(),
      parseInt(month) - 1,
      1,
    );
    return monthString.toLocaleString('default', { month: 'short' });
  }

  private getColors(data: number[]): string[] {
    return data.map((i) => {
      if (i === 0) {
        return;
      }
      return this.getRandomColor();
    });
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }

  private getLabelsAndDataByTimePeriodByPage(
    aggregate: any[],
    timePeriod: string,
  ): { labels: string[]; data: number[] } {
    const labels = this.getLabels(timePeriod);
    const data = labels.map((label) => {
      const item = aggregate.find((item) => {
        const month = this.getMonthNumberFromDate(item.period);
        return month === label;
      });
      return item ? item.pageViews : 0;
    });
    return { labels, data };
  }

  private getLabelsAndDataByTimePeriodByBounceRate(
    aggregate: any[],
    timePeriod: string,
  ): { labelsBounce: string[]; dataBounce: number[] } {
    const labelsBounce = this.getLabels(timePeriod);

    const dataBounce = labelsBounce.map((label) => {
      const item = aggregate.find((item) => {
        const month = this.getMonthNumberFromDate(item.period);
        return month === label;
      });
      return item ? item.bounceRate : 0;
    });

    return { labelsBounce, dataBounce };
  }
}
