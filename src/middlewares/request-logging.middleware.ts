import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestLoggingMiddleware.name);
    use(req: Request, res: Response, next: NextFunction) {
        const now = Date.now();
        console.log(
            "=========================================================================="
        );
        this.logger.debug(`START REQUEST: ${req.method} ${req.originalUrl}`);
        res.on("finish", () => {
            const duration = Date.now() - now;
            this.logger.debug(
                `END REQUEST: ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
            );
        });

        next();
    }
}
