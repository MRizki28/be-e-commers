import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from 'src/dto/product.dto';
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

    @Post('/create')
    @UseInterceptors(FileInterceptor('product_img'))
    async create(@Body() data: ProductDto, @UploadedFile() productImg: Express.Multer.File): Promise<any> {
        return this.productService.createData(data, productImg);
    }
}
