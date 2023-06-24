import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApiKeyInterceptor implements NestInterceptor {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.get('Authorization');
    const [authorizationType, token] = authorizationHeader.split(' ');
    if (!token) {
      throw new BadRequestException('Token is missing');
    }

    try {
      const { id } = this.jwtService.verify(token);
      const user = await this.usersService.findOneById(id);

      if (!user) {
        throw new BadRequestException('Invalid user');
      }
      request.apiKey = user.apiKey;
      return next.handle();
    } catch (error) {
      throw error;
    }
  }
}
