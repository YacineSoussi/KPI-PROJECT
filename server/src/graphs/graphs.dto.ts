import { IsDefined, IsString } from 'class-validator';

export class CreateGraphDto {
  @IsDefined()
  @IsString()
  public metric: string;

  @IsDefined()
  @IsString()
  public type: string;

  @IsDefined()
  @IsString()
  public timePeriod: string;

  public tag?: string;

  public apiKey?: string;

  public data?: any[];
}

export class UpdateGraphDto implements Partial<CreateGraphDto> {}
