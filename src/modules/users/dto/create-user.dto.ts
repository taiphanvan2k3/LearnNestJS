import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength
} from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(["INTERN", "ENGINEER", "ADMIN"], {
        message: "invalid role"
    })
    role: Role;
}
