import { Injectable } from '@nestjs/common';

// Dùng annotation @Injectable() để đánh dấu class này có thể dùng để inject vào các class khác
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World';
    }
}
