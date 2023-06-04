import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./authentication.dto";
import { compare, hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/users.dto";

@Injectable()
export class AuthenticationService {

public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
    ) { }

    public async login(LoginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(LoginDto.email);
    
        if (!user) {
          throw new BadRequestException("Invalid email or password");
        }
    
        const isValidPassword = await compare(LoginDto.password, user.password);
    
        if (!isValidPassword) {
          throw new BadRequestException("Invalid email or password");
        }
    
        const payload = {
          id: user.id,
          role: user.role
        };
    
        const token = this.jwtService.sign(payload);
    
        return token;
      }

    public async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
    
        if (!user) {
          throw new BadRequestException("Invalid email or password");
        }
    
        const isValidPassword = await compare(password, user.password);
    
        if (!isValidPassword) {
          throw new BadRequestException("Invalid email or password");
        }
    
        return user;
      }
    
    public async register(user: CreateUserDto) {
      const existingUser = await this.usersService.findOneByEmail(user.email);

      if (existingUser) {
        throw new BadRequestException("Un compte existe déjà avec cette adresse email");
      }
      const hashedPassword = await hash(user.password, 10);

      const newUser = {
        email: user.email,
        password: hashedPassword,
        url: user.url,
      };

      return await this.usersService.register(newUser);
    }

    public async getUserFromToken(token: string) {
      try {
        const { id } = this.jwtService.verify(token);
        const user = await this.usersService.findOneById(id);
    
        if (!user) {
          throw new BadRequestException("Invalid user");
        }
    
        return user;
      } catch (error) {
        throw error;
      }
    }
    
}
