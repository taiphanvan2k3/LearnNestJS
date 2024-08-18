import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

// Tất cả các trường trong CreateUserDto đều trở thành optional
// và kế thừa cả các decorator validation từ CreateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {}
