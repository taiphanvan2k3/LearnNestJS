import {
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { MyLoggerService } from "src/modules/my-logger/my-logger.service";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

type ResponseObj = {
    statusCode: number;
    timestamp: string;
    path: string;
    response: string | object;
};

// Điều này sẽ bắt tất cả các lỗi không riêng gì HttpException
@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new MyLoggerService(AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const responseData: ResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: ""
        };

        if (exception instanceof HttpException) {
            responseData.statusCode = exception.getStatus();
            if (exception instanceof BadRequestException) {
                responseData.response = (
                    exception.getResponse() as any
                ).message;
            } else {
                responseData.response = exception.getResponse();
            }
        } else if (exception instanceof PrismaClientValidationError) {
            responseData.statusCode = 422;
            responseData.response = exception.message.replace(/\n/g, "");
        } else {
            responseData.response = "Internal server error";
        }

        response.status(responseData.statusCode).json(responseData);
        this.logger.error(
            typeof responseData.response === "string"
                ? responseData.response
                : (responseData.response as any).message,
            AllExceptionFilter.name
        );
        super.catch(exception, host);
    }
}
