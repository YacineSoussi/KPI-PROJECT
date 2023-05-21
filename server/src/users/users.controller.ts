import { Controller, Get, Post, HttpCode, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticationRequired, HasRole } from 'src/authentication/authentication.decorator';
import { Role } from 'src/authentication/authentication.enum';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @HasRole(Role.ADMIN)
    @AuthenticationRequired()
    @Get()
    getUsers() {
        return this.usersService.findAll();
    }

    @HasRole(Role.ADMIN)
    @AuthenticationRequired()
    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }
}
