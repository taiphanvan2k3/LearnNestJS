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
    NotFoundException,
    HttpException,
    Ip,
    BadRequestException
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { Prisma } from "@prisma/client";
import { Role } from "src/common/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, SkipThrottle } from "@nestjs/throttler";
import { MyLoggerService } from "../my-logger/my-logger.service";

// Việc SkipThrottle đặt ở controller sẽ bỏ qua việc giới hạn request tại controller này
@SkipThrottle()
@ApiTags("Employees")
@Controller("employees")
export class EmployeesController {
    private readonly logger = new MyLoggerService(EmployeesController.name);
    constructor(private readonly employeeService: EmployeesService) {}

    // route này không nên bỏ qua các giới hạn throttle. Nghĩa là, throttle mặc định sẽ vẫn được áp dụng.
    // 2 configure về throttle tại App sẽ được áp dụng lên endpoint này
    @SkipThrottle({ default: false })
    @Get()
    async findAll(@Ip() ip: string, @Query("role") role?: Role) {
        this.logger.log(`Find all employees\t${ip}`);
        if (role && role != "ADMIN" && role != "ENGINEER" && role != "INTERN") {
            throw new BadRequestException("Invalid role");
        }
        return await this.employeeService.findAll(role);
    }

    // Nó sẽ ghi đè throttle có name là short, những vẫn giữ lại configure của throttle có name là long
    // Nếu cấu hình forRoot của ta không có chỉ định tên như nào và ở đây ta muốn overwrite thì sử dụng default tại vị trí giống short
    @Throttle({ short: { ttl: 1000, limit: 1 } })
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
