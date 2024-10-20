import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get('/')
    async getAllData(@Query() req): Promise<any> {
        return this.productService.getAllData(req);
    }
}
