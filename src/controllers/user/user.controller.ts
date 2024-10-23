import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/config/jwt/jwtAuth.guard';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user/user.service';

@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @Roles(Role.ADMIN)
    async getAllData(@Query() req) {
        return await this.userService.getAllData(req);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createData(@Body() userDto: UserDto) : Promise<any> {
        return await this.userService.createData(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get/:id')
    @Roles(Role.ADMIN, Role.USER)
    async getDataById(@Param('id') id: string): Promise<any> {
        return await this.userService.getDataById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update/:id')
    @Roles(Role.ADMIN)
    async updateData(@Param('id') id: string, @Body() userDto: UserDto): Promise<any> {
        return await this.userService.updateData(id, userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    @Roles(Role.ADMIN)
    async deleteData(@Param('id') id: string): Promise<any> {
        return await this.userService.deleteData(id);
    }
}
