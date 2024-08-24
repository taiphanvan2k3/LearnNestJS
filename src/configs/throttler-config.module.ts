import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
    imports: [
        ThrottlerModule.forRoot([
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
                ttl: 60 * 1000,
                limit: 100
            }
        ])
    ]
})
export class ThrottlerConfigModule {}
