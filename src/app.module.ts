import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { APP_GUARD, APP_FILTER } from "@nestjs/core";
import { EmployeesModule } from "./modules/employees/employees.module";
import { ThrottlerGuard } from "@nestjs/throttler";
import { MyLoggerModule } from "./modules/my-logger/my-logger.module";
import { AllExceptionFilter } from "./filters/all-exceptions.filter";
import { ThrottlerConfigModule } from "./configs/throttler-config.module";
import { PrismaConfigModule } from "./configs/prisma-config.module";
import { RequestLoggingMiddleware } from "./middlewares/request-logging.middleware";

@Module({
    imports: [
        UsersModule,
        MyLoggerModule,
        EmployeesModule,

        // Phần imports của các file Module sẽ được gọi và thực thi
        ThrottlerConfigModule,
        PrismaConfigModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter
        }
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggingMiddleware).forRoutes("*"); // Apply to all routes
    }
}
