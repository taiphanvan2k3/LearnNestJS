import { Injectable } from "@nestjs/common";
import { Role } from "src/common/enums/role.enum";
import { ResponseInfo } from "src/common/response-info";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// Mặc định service này có scope là singleton, tức là mỗi request sẽ sử dụng chung một instance của service này
@Injectable()
export class UsersService {
    private users = [
        {
            id: 1,
            name: "Leanne Graham",
            email: "Sincere@april.biz",
            role: "INTERN"
        },
        {
            id: 2,
            name: "Ervin Howell",
            email: "Shanna@melissa.tv",
            role: "INTERN"
        },
        {
            id: 3,
            name: "Clementine Bauch",
            email: "Nathan@yesenia.net",
            role: "ENGINEER"
        },
        {
            id: 4,
            name: "Patricia Lebsack",
            email: "Julianne.OConner@kory.org",
            role: "ENGINEER"
        },
        {
            id: 5,
            name: "Chelsey Dietrich",
            email: "Lucio_Hettinger@annie.ca",
            role: "ADMIN"
        }
    ];

    getUsers(role?: Role) {
        if (role) {
            return this.users.filter((user) => user.role === role);
        }
        return this.users;
    }

    getUserById(id: number) {
        const user = this.users.filter((user) => user.id == id)?.[0];
        if (!user) {
            return null;
        }
        return user;
    }

    create(createUserDto: CreateUserDto) {
        const maxUserId = [...this.users].sort((a, b) => b.id - a.id)[0].id;
        const newUser = {
            id: maxUserId + 1,
            ...createUserDto
        };
        this.users.push(newUser);
        return newUser;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        const responseInfo = new ResponseInfo(200, "Ok", {});
        const userInDB = this.users.filter((user) => user.id === id)?.[0];
        if (!userInDB) {
            return null;
        }

        if (updateUserDto.name) {
            userInDB.name = updateUserDto.name;
        }

        if (updateUserDto.email) {
            userInDB.email = updateUserDto.email;
        }

        if (updateUserDto.role) {
            userInDB.role = updateUserDto.role;
        }

        responseInfo.data.user = userInDB;
        return responseInfo;
    }

    delete(id: number) {
        const responseInfo = new ResponseInfo(200, "Ok", {});
        const userIndex = this.users.findIndex((user) => user.id === id);
        const deletedUser = this.users[userIndex];
        if (userIndex === -1) {
            return null;
        }

        this.users.splice(userIndex, 1);
        responseInfo.data.deletedUser = deletedUser;
        return responseInfo;
    }
}
