import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionFilter } from "./filters/all-exceptions.filter";

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
    app.enableCors();
    app.setGlobalPrefix("api");

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle("NestJS example")
        .setDescription("The NestJS API description")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/swagger", app, document);

    await app.listen(5001);
}
bootstrap();
