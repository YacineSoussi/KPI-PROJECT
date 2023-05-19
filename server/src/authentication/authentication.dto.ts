import { IsDefined, IsString } from "class-validator";
import { UserInterface } from "src/users/users.interface";

export class LoginDto {
  @IsDefined()
  @IsString()
  public email: string;

  @IsDefined()
  @IsString()
  public password: string;
}

