import { Module } from '@nestjs/common';
import { CartController } from 'src/controllers/cart/cart.controller';
import { CartService } from 'src/services/cart/cart.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    imports: [],
    controllers: [CartController],
    providers: [CartService, PrismaService],
})
export class CartModule {}
