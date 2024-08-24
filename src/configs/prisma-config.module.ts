// prisma-config.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule, loggingMiddleware, QueryInfo } from "nestjs-prisma";
import { Logger } from "@nestjs/common";

@Module({
    imports: [
        PrismaModule.forRoot({
            isGlobal: true,
            prismaServiceOptions: {
                explicitConnect: true,

                // Đây chỉ là điều kiện cần, điều kiện đủ là tại main.ts ta cần phải cho lắng nghe sự kiện $on("query") của PrismaService
                middlewares: [
                    loggingMiddleware({
                        logger: new Logger("PrismaMiddleware"),
                        logLevel: "debug",
                        logMessage: (query: QueryInfo) =>
                            `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`
                    })
                ]
            }
        })
    ]
})
export class PrismaConfigModule {}
