import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "nestjs-prisma";
import { setupSwagger } from "./configs/swagger.config";
import { INestApplication } from "@nestjs/common";

async function configureApp(app: INestApplication) {
    app.enableCors();
    app.setGlobalPrefix("api");
}

async function bootstrap() {
    //#region Uncomment this block to enable the global logger
    // const app = await NestFactory.create(AppModule, {
    //     // verbose là cấp độ chi tiết nhất của log, các log có level >= sẽ được in ra
    //     logger: ["verbose"],

    //     // Các log xảy ra trong quá trình khởi tạo ứng dụng sẽ được buffer lại và in ra sau khi ứng dụng đã khởi tạo xong
    //     bufferLogs: true
    // });

    // // Thiết lập một logger global cho ứng dụng
    // app.useLogger(app.get("MyLoggerService"));
    //#endregion

    const app = await NestFactory.create(AppModule);
    configureApp(app);

    // Sử dụng cách thêm vào providers trong AppModule tiện hơn
    // const { httpAdapter } = app.get(HttpAdapterHost);
    // app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

    // Prisma logging middleware
    const prismaService: PrismaService = app.get(PrismaService);
    prismaService.$on("query", (event) => {
        console.log(event);
    });

    setupSwagger(app);
    await app.listen(5001);
}
bootstrap();
