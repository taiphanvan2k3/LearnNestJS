import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @ApiOkResponse({ description: 'Returns an array of users', type: [String] })
    getUsers(): string[] {
        return this.userService.getUsers();
    }
}
