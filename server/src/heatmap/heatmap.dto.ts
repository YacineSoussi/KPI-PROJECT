import { IsDefined } from 'class-validator';

export class HeatmapDto {
  @IsDefined()
  apiKey: string;

  @IsDefined()
  sessionId: string;

  @IsDefined()
  visitorId: string;

  @IsDefined()
  url: string;

  @IsDefined()
  pageSize: { x: number; y: number };

  @IsDefined()
  x: number;

  @IsDefined()
  y: number;
}
