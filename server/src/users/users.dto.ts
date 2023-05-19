import { IsDefined, IsString } from 'class-validator';
import { UserInterface } from './users.interface';

export class CreateUserDto {
    @IsDefined()
    @IsString()
    public email: string;

    @IsDefined()
    @IsString()
    public password: string;

    @IsDefined()
    @IsString()
    public url: string;
    
}

export class UpdateUserDto implements Partial<UserInterface> {}