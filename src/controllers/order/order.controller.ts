import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/config/jwt/jwtAuth.guard';
import { OrderService } from 'src/services/order/order.service';
export interface User {
    userId: string;
}


@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    @Roles(Role.USER)
    async createOrder(@Req() req: Request & { user: User }): Promise<any> {
        return this.orderService.createOrder(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @Roles(Role.USER)
    async getAllOrder(@Req() req: Request & { user: User }): Promise<any> {
        return this.orderService.getAllOrder(req);
    }

}
