import {
    Body,
    Controller,
    Delete,
    Get,
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

@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get() // GET /users?role=value
    @ApiOkResponse({ description: "Returns an array of users", type: [String] })
    getUsers(@Query("role") role?: "INTERN" | "ENGINEER" | "ADMIN"): object {
        return {
            role,
            users: this.userService.getUsers()
        };
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
    getUserById(@Param("id") id: number): object {
        return {
            userId: id
        };
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
                age: {
                    type: "number",
                    example: 21
                }
            }
        }
    })
    create(@Body() user: { name: string; age: number }): object {
        return {
            version: "application/json",
            user
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
                age: {
                    type: "number",
                    example: 21
                }
            }
        }
    })
    createByForm(@Body() user: { name: string; age: number }): object {
        return {
            version: "multipart/form-data",
            note: "need to use @UseInterceptors(AnyFilesInterceptor()) for form-data",
            user
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
                age: {
                    type: "number",
                    example: 21
                }
            }
        }
    })
    update(@Param("id") id: string, @Body() updatedUser: object) {
        return { id, user: updatedUser };
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return {
            message: `User with id=${id} is deleted`
        };
    }
}
