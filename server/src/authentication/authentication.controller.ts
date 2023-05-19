import { CreateUserDto } from 'src/users/users.dto';
import { LoginDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';
import { Controller, Post, Body, ValidationPipe, HttpCode } from '@nestjs/common';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly AuthenticationService: AuthenticationService) { }

    @Post('login')
    public login(@Body(ValidationPipe) LoginDto: LoginDto) {
        return this.AuthenticationService.login(LoginDto);
    }


    @Post('register')
    @HttpCode(200)
    public register(@Body(ValidationPipe) user: CreateUserDto) {
        return this.AuthenticationService.register(user);
    }

}
