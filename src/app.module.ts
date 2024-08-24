import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { APP_GUARD, APP_FILTER } from "@nestjs/core";
import { HttpErrorFilter } from "./filters/http-error.filter";
import { DatabaseModule } from "./database/database.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { MyLoggerModule } from './modules/my-logger/my-logger.module';

@Module({
    imports: [
        UsersModule,
        DatabaseModule,
        EmployeesModule,
        ThrottlerModule.forRoot([
            // configure dưới đây sẽ quy định trong không quá 3 request trong 1s, 20 request trong 10s và 100 request trong 60s
            {
                name: "short",
                ttl: 1000,
                limit: 3
            },
            {
                name: "medium",
                ttl: 10000,
                limit: 5
            },
            {
                name: "long",
                ttl: 60 * 1000, // tts tính bằng mili giây
                limit: 100
            }
        ]),
        MyLoggerModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
