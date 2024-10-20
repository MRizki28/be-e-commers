import { Module } from '@nestjs/common';
import { ProductController } from 'src/controllers/product/product.controller';
import { PrismaService } from 'src/services/prisma.service';
import { ProductService } from 'src/services/product/product.service';

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [ProductService, PrismaService],
})
export class ProductModule {}
