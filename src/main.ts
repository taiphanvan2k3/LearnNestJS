import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.setGlobalPrefix("api");

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
