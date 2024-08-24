import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { promises as fsPromises } from "fs";

@Injectable()
export class MyLoggerService extends ConsoleLogger {
    async logToFile(entry: string) {
        const formattedDate = Intl.DateTimeFormat("vi-VN", {
            dateStyle: "medium",
            timeStyle: "long",
            timeZone: "Asia/Ho_Chi_Minh"
        }).format(new Date());
        const formattedEntry = `${formattedDate}\t${entry}\n`;

        try {
            // Để lấy thư mục gốc của project thay vì thư mục dist
            const rootDir = path.resolve(process.cwd());
            if (!fs.existsSync(path.join(rootDir, "logs"))) {
                await fsPromises.mkdir(path.join(rootDir, "logs"));
            }

            await fsPromises.appendFile(
                path.join(rootDir, "logs", "app.log"),
                formattedEntry
            );
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
        }
    }

    log(message: any, context?: string): void {
        context ??= this.context;
        const entry = `${context ?? ""}\t${message}`;
        this.logToFile(entry);
        super.log(message, context);
    }

    error(message: any, trace?: string, context?: string): void {
        context ??= this.context;
        const entry = `${context ?? ""}\t${message}`;
        this.logToFile(entry);
        super.error(message, trace, context);
    }
}
