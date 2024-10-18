import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/config/jwt/jwtAuth.guard';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllData(@Query() req) {
        return await this.userService.getAllData(req);
    }

    @Post('/create')
    async createData(@Body() userDto: UserDto) {
        return await this.userService.createData(userDto);
    }

    @Get('/get/:id')
    async getDataById(@Param('id') id: string) {
        return await this.userService.getDataById(id);
    }

    @Post('/update/:id')
    async updateData(@Param('id') id: string, @Body() userDto: UserDto) {
        return await this.userService.updateData(id, userDto);
    }

    @Delete('/delete/:id')
    async deleteData(@Param('id') id: string) {
        return await this.userService.deleteData(id);
    }
}
