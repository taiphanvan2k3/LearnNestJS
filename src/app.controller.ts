import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users/users.service";

@ApiTags("app")
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly userService: UsersService
    ) {}

    @Get()
    getHello(): string {
        const message: string = `${this.appService.getHello()}. List of users in our system: ${this.userService.getUsers()}`;
        return message;
    }
}
