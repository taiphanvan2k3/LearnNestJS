import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Role } from "src/common/enums/role.enum";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class EmployeesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findAll(role: Role) {
        const employees = await this.databaseService.employee.findMany({
            where: role ? { role } : {}
        });
        return employees;
    }

    async findOne(id: number) {
        // nên dùng findUnique cho việc
        return this.databaseService.employee.findUnique({
            where: { id }
        });
    }

    async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
        return this.databaseService.employee.create({
            data: createEmployeeDto
        });
    }

    async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
        const employee = await this.findOne(id);
        if (!employee) {
            return null;
        }

        // Không thể update trên đối tượng trả về mà cần gọi lại hàm update
        return this.databaseService.employee.update({
            where: { id },
            data: updateEmployeeDto
        });
    }

    async remove(id: number) {
        const employee = await this.findOne(id);
        if (!employee) {
            return null;
        }

        return this.databaseService.employee.delete({
            where: { id }
        });
    }
}
