import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./filters/http-error.filter";

@Module({
    imports: [UsersModule],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter
        },
        AppService
    ]
})
export class AppModule {}
