import { Controller, Get, Post, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers() {
        return this.usersService.findAll();
    }

}
