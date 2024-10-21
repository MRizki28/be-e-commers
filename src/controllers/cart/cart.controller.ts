import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from 'src/services/cart/cart.service';
import { Request } from 'express';
import { CartDto } from 'src/dto/cart.dto';
import { JwtAuthGuard } from 'src/config/jwt/jwtAuth.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorator/role.decorator';

export interface User {
    userId: string;
}

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @Roles(Role.USER)
    async getDataCartByUser(@Req() req: Request & {user: User}): Promise<any> {
        return this.cartService.getDataCartByUser(req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    @Roles(Role.USER)
    async createData(@Req() req, @Body() cartDto: CartDto): Promise<any> {
        return this.cartService.createData(req, cartDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update/:id')
    @Roles(Role.USER)
    async updateCart(@Req() req, @Body() cartDto: CartDto,@Param('id') id: string): Promise<any> {
        return this.cartService.updateCart(req, cartDto, id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    @Roles(Role.USER)
    async deleteCart(@Req() req, @Param('id') id: string): Promise<any> {
        return this.cartService.deleteCart(req, id);
    }
    
}
