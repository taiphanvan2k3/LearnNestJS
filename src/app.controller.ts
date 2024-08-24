import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeController } from "@nestjs/swagger";
import { UsersService } from "./modules/users/users.service";

// Không muốn controller này show lên swagger
@ApiExcludeController()
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
