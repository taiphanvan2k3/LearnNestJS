import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiQuery,
    ApiTags
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

import { Role } from "src/common/enums/role.enum";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get() // GET /users?role=value
    @ApiOkResponse({ description: "Returns an array of users", type: [String] })
    @ApiQuery({
        name: "role",
        enum: ["INTERN", "ENGINEER", "ADMIN"],
        required: false
    })
    getUsers(@Query("role") role?: Role): object {
        if (role && role != "INTERN" && role != "ENGINEER" && role != "ADMIN") {
            throw new BadRequestException("Invalid role");
        }
        return this.userService.getUsers(role);
    }

    // Ta cần đặt đặt route /search trước route /:id vì nếu không, NestJS sẽ hiểu rằng route /search là một id
    // và gọi route /:id thay vì route /search
    @Get("search") // GET /users/search
    @ApiQuery({ name: "name", required: false })
    @ApiQuery({ name: "address", required: false })
    searchUsers(
        @Query("name") name: string,
        @Query("address") address: string
    ): object {
        return {
            name,
            address
        };
    }

    @Get(":id") // GET /users/:id
    getUserById(@Param("id", ParseIntPipe) id: number): object {
        const user = this.userService.getUserById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    @Post() // POST /users
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "Phan Văn Tài"
                },
                email: {
                    type: "string",
                    example: "abc@gmail.com"
                },
                role: {
                    type: "string",
                    enum: ["INTERN", "ENGINEER", "ADMIN"],
                    example: "INTERN"
                }
            }
        }
    })
    create(@Body(ValidationPipe) createUserDto: CreateUserDto): object {
        const createdUser = this.userService.create(createUserDto);
        return {
            version: "application/json",
            user: createdUser
        };
    }

    @Post("/create-by-form-data") // POST /users/create-by-form-data
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(AnyFilesInterceptor())
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "Phan Văn Tài"
                },
                email: {
                    type: "string",
                    example: "abc@gmail.com"
                },
                role: {
                    type: "string",
                    enum: ["INTERN", "ENGINEER", "ADMIN"],
                    example: "INTERN"
                }
            }
        }
    })
    createByForm(
        @Body() user: { name: string; email: string; role: Role }
    ): object {
        const createdUser = this.userService.create(user);
        return {
            version: "multipart/form-data",
            user: createdUser
        };
    }

    @Patch(":id") // Patch /user/:id
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "Phan Văn Tài"
                },
                email: {
                    type: "string",
                    example: "abc@gmail.com"
                },
                role: {
                    type: "string",
                    enum: ["INTERN", "ENGINEER", "ADMIN"],
                    example: "INTERN"
                }
            }
        }
    })
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body(ValidationPipe) updatedUserDto: UpdateUserDto
    ) {
        try {
            let response = this.userService.update(id, updatedUserDto);
            if (!response) {
                throw new NotFoundException("User not found");
            }
            return response;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number) {
        try {
            let response = this.userService.delete(id);
            if (!response) {
                throw new NotFoundException("User not found");
            }

            return response;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
