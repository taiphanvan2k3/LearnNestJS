import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class EmployeesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(role: Role) {
        const employees = await this.prisma.employee.findMany({
            where: role ? { role } : {}
        });
        return employees;
    }

    async findOne(id: number) {
        // nên dùng findUnique cho việc
        return this.prisma.employee.findUnique({
            where: { id }
        });
    }

    async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
        return this.prisma.employee.create({
            data: createEmployeeDto
        });
    }

    async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
        const employee = await this.findOne(id);
        if (!employee) {
            return null;
        }

        // Không thể update trên đối tượng trả về mà cần gọi lại hàm update
        return this.prisma.employee.update({
            where: { id },
            data: updateEmployeeDto
        });
    }

    async remove(id: number) {
        const employee = await this.findOne(id);
        if (!employee) {
            return null;
        }

        return this.prisma.employee.delete({
            where: { id }
        });
    }
}
