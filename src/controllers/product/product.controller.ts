import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from 'src/dto/product.dto';
import { ProductService } from 'src/services/product/product.service';

@Controller('api/v1/product')
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

    @Get('/get/:id')
    async getDataById(@Param('id') id: string): Promise<any> {
        return this.productService.getDataById(id);
    }

    @Post('/update/:id')
    @UseInterceptors(FileInterceptor('product_img'))
    async updateData(@Param('id') id: string, @Body() data: ProductDto, @UploadedFile() productImg: Express.Multer.File): Promise<any> {
        return this.productService.updateData(id, data, productImg);
    }

    @Delete('/delete/:id')
    async deleteData(@Param('id') id: string): Promise<any> {
        return this.productService.deleteData(id);
    }

    @Get('/img/:filename')
    async getImgUrl(filename: string): Promise<any> {
        return this.productService.getImgUrl(filename);
    }
}
