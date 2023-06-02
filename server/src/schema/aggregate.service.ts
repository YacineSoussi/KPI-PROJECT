import { Event } from './event.model';
import { Session } from './session.model';
import { Model } from 'mongoose';

export class AggregateService {
  constructor(
    private readonly eventModel: Model<Event>,
    private readonly sessionModel: Model<Session>,
  ) {}

  async generateDynamicAggregate(
    metric: string,
    dimension?: string,
    tag?: string,
    timePeriod?: string,
  ) {
    let aggregate = [];

    switch (metric) {
      case 'bounceRate':
        aggregate = await this.calculateBounceRateAggregate(timePeriod);
        break;

      case 'averageSessionDuration':
        aggregate = await this.calculateAverageSessionDurationAggregate(timePeriod);
        break;

      case 'pageViews':
        aggregate = await this.calculatePageViewsAggregate(timePeriod);
        break;

      case 'clickRate':
        if (tag) {
          aggregate = await this.calculateClickRateByTagAggregate(tag, timePeriod);
        } else {
          aggregate = await this.calculateGlobalClickRateAggregate(timePeriod);
        }
        break;

      case 'session':
        aggregate = await this.calculateSessionAggregate(timePeriod);
        break;

      // Ajoutez des cas pour d'autres options de métriques

      default:
        // Cas par défaut si aucune métrique n'est sélectionnée
        break;
    }

    // Appliquer les étapes d'agrégation supplémentaires en fonction de la dimension sélectionnée
    if (dimension) {
      switch (dimension) {
        case 'source':
          aggregate = this.applySourceDimensionAggregation(aggregate);
          break;
  
        case 'browser':
          aggregate = this.applyBrowserDimensionAggregation(aggregate);
          break;
  
        case 'device':
          aggregate = this.applyDeviceDimensionAggregation(aggregate);
          break;
  
        // Ajoutez des cas pour d'autres options de dimensions
  
        default:
          // Cas par défaut si aucune dimension n'est sélectionnée
          break;
      }
    }

    return aggregate;
  }
  //  Taux de rebond 
  private async calculateBounceRateAggregate(timePeriod?: string) {
    const aggregate = await this.eventModel.aggregate([
      // Étape d'agrégation pour compter les pageViews par session
      {
        $match: {
          type: "pageView", // Filtrer uniquement les événements de type "pageView"
        },
      },
      {
        $group: {
          _id: "$sessionId",
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
          averageSessionDuration: { $avg: "$duration" },
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
          totalPageViews: { $sum: "$pageViews" },
        },
      },
      { $match: this.getTimePeriodMatch(timePeriod) },
    ]);
  
    return aggregate;
  }
  
  // Taux de clics par tag
  private async calculateClickRateByTagAggregate(tag: string, timePeriod?: string) {
    const aggregate = await this.eventModel.aggregate([
      // Étape d'agrégation pour compter le nombre total de clics par tag
      {
        $match: {
          type: "click",
          tag,
          ...this.getTimePeriodMatch(timePeriod),
        },
      },
      // Étape d'agrégation pour grouper les clics par session
      {
        $group: {
          _id: "$sessionId",
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
  
  // Taux de clics global
  private async calculateGlobalClickRateAggregate(timePeriod?: string) {
    const aggregate = await this.eventModel.aggregate([
      // Étape d'agrégation pour compter le nombre total de clics
      {
        $match: {
          type: "click",
          ...this.getTimePeriodMatch(timePeriod),
        },
      },
      // Étape d'agrégation pour compter le nombre total de sessions avec clics
      {
        $group: {
          _id: "$sessionId",
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
    let groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
  
    if (timePeriod === "month") {
      groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else if (timePeriod === "year") {
      groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } };
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

  private applySourceDimensionAggregation(aggregate: any[]): any[] {
    const aggregationStages = [
      // Étape d'agrégation pour grouper par source de trafic
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
        },
      },
    ];
  
    // Ajouter les étapes d'agrégation au pipeline de l'agrégat
    aggregate = aggregate.concat(aggregationStages);
  
    return aggregate;
  }
  
  private applyBrowserDimensionAggregation(aggregate: any[]): any[] {
    const aggregationStages = [
      // Étape d'agrégation pour grouper par navigateur
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
    ];
  
    // Ajouter les étapes d'agrégation au pipeline de l'agrégat
    aggregate = aggregate.concat(aggregationStages);
  
    return aggregate;
  }
  
  private applyDeviceDimensionAggregation(aggregate: any[]): any[] {
    const aggregationStages = [
      // Étape d'agrégation pour grouper par appareil
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
    ];
  
    // Ajouter les étapes d'agrégation au pipeline de l'agrégat
    aggregate = aggregate.concat(aggregationStages);
  
    return aggregate;
  }
  

  private getTimePeriodMatch(timePeriod?: string) {
    let matchCondition = {};

    if (timePeriod === 'day') {
      matchCondition = { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } };
    } else if (timePeriod === 'week') {
      matchCondition = { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) } };
    } else if (timePeriod === 'month') {
      matchCondition = { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } };
    }

    return matchCondition;
  }
}
