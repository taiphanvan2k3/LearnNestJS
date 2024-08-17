import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors
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
import { ResponseInfo } from "src/common/response-info";

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
    getUserById(@Param("id") id: string): object {
        return this.userService.getUserById(+id);
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
    create(@Body() user: { name: string; email: string; role: Role }): object {
        const createdUser = this.userService.create(user);
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
        @Param("id") id: string,
        @Body() updatedUser: { name?: string; email?: string; role?: Role }
    ) {
        let response: ResponseInfo = new ResponseInfo();
        try {
            response = this.userService.update(+id, updatedUser);
        } catch (error) {
            response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return response;
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        let response: ResponseInfo = new ResponseInfo();
        try {
            response = this.userService.delete(+id);
        } catch (error) {
            response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return response;
    }
}
