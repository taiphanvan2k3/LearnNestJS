import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { APP_GUARD, APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./filters/http-error.filter";
import { DatabaseModule } from "./database/database.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";

@Module({
    imports: [
        UsersModule,
        DatabaseModule,
        EmployeesModule,
        ThrottlerModule.forRoot([
            {
                name: "short",
                ttl: 1000,
                limit: 3
            },
            {
                name: "long",
                ttl: 60 * 1000, // tts tính bằng mili giây
                limit: 10
            }
        ])
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
