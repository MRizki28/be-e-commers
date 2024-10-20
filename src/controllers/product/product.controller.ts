import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from 'src/dto/product.dto';
import { ProductService } from 'src/services/product/product.service';
import { Response } from 'express';

@Controller('api/v1/product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

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
    async getImgUrl(@Param('filename') filename: string, @Res() res: Response): Promise<any> {
        const imagePath = await this.productService.getImgUrl(filename);
        return res.sendFile(imagePath);
    }
}
