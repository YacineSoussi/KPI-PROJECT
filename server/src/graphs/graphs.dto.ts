import { IsDefined, IsString } from "class-validator";

export class CreateGraphDto {
    @IsDefined()
    @IsString()
    public metric: string;

    @IsDefined()
    @IsString()
    public type: string;

    @IsDefined()
    @IsString()
    public dimension: string;

    @IsDefined()
    @IsString()
    public timePeriod: string;

    public tag?: string;

    public apiKey?: string[];
}

export class UpdateGraphDto implements Partial<CreateGraphDto> {}
