import { VisitorInterface } from "../visitor.interface";
import { IsString, IsNotEmpty, IsDate } from 'class-validator';


export class CreateVisitorDto implements Omit<VisitorInterface, "id" | "date"> {
    
    @IsNotEmpty()
    @IsString()
    country: string;
    
    @IsNotEmpty()
    @IsString()
    page: string;
    
    
}

export class UpdateVisitorDto implements Partial<CreateVisitorDto> {}
