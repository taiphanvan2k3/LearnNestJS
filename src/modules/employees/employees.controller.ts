import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    InternalServerErrorException,
    HttpCode,
    NotFoundException,
    HttpException
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { Prisma } from "@prisma/client";
import { Role } from "src/common/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Employees")
@Controller("employees")
export class EmployeesController {
    constructor(private readonly employeeService: EmployeesService) {}

    @Get()
    async findAll(@Query("role") role?: Role) {
        return await this.employeeService.findAll(role);
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const employee = await this.employeeService.findOne(id);
            if (!employee) {
                throw new NotFoundException("Employee not found");
            }

            return {
                employee
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post()
    async create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
        try {
            const employee =
                await this.employeeService.create(createEmployeeDto);
            return {
                message: "Employee created successfully",
                employee
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch(":id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput
    ) {
        try {
            const employee = await this.employeeService.update(
                id,
                updateEmployeeDto
            );
            if (!employee) {
                throw new NotFoundException("Employee not found");
            }

            return {
                message: "Employee updated successfully",
                employee
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(":id")
    async remove(@Param("id", ParseIntPipe) id: number) {
        try {
            const employee = await this.employeeService.remove(id);
            if (!employee) {
                throw new NotFoundException("Employee not found");
            }

            return {
                message: "Employee deleted successfully",
                employee
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
