import { CreateUserDto } from 'src/users/users.dto';
import { LoginDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';
import { Controller, Get, Req, Post, Body, ValidationPipe, HttpCode } from '@nestjs/common';
import { AuthenticationRequired } from './authentication.decorator';

@Controller('auth')
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

    @AuthenticationRequired()
    @Get('me')
    public me(@Req() request: any) {
        return this.AuthenticationService.getUserFromToken(request.headers.authorization.slice(7));
    }


}
