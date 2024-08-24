import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException
} from "@nestjs/common";

// HttpErrorFilter này chỉ bắt lỗi từ HttpException
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status =
            exception instanceof HttpException ? exception.getStatus() : 500;

        let message = exception.message || "Internal server error";
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            message = (response as any).message || exception.message;
        }

        response.status(status).json({
            statusCode: status,
            statusText: exception.name,
            message
        });
    }
}
