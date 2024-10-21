import { Module } from '@nestjs/common';
import { OrderController } from 'src/controllers/order/order.controller';
import { OrderService } from 'src/services/order/order.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    imports: [],
    controllers: [OrderController],
    providers: [OrderService, PrismaService],
})
export class OrderModule {}
