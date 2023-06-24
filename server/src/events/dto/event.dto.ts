import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateEventDto {
  tag?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  visitorId: string;

  @IsString()
  @IsNotEmpty()
  page: string;

  @IsString()
  @IsOptional()
  referer: string;

  @IsString()
  @IsOptional()
  ip: string;

  @IsString()
  @IsOptional()
  browser: string;

  @IsString()
  @IsOptional()
  os: string;

  @IsString()
  @IsOptional()
  device: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
