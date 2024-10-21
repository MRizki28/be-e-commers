import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HttpResponseTraits } from 'src/traits/HttpResponseTrait';
import { ProductDto } from 'src/dto/product.dto';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
// import Decimal from 'decimal.js';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getAllData(req): Promise<any> {
        console.log(req);
        const {
            page = 1,
            limit = 1,
            search = ''
        } = req || {};

        console.log('Searching for:', search);

        const skip = (page - 1) * limit;

        const data = await this.prisma.product.findMany({
            where: {
                OR: [
                    {
                        name_product: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        stock: {
                            equals: Number(search) || 0
                        }
                    },
                    {
                        price: {
                            equals: Number(search) || 0
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            skip,
            take: Number(limit)
        });

        const totalData = await this.prisma.product.count({
            where: {
                OR: [
                    {
                        name_product: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        stock: {
                            equals: Number(search) || 0
                        }
                    },
                    {
                        price: {
                            equals: Number(search) || 0
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        }) || 0;


        const totalPage = Math.ceil(totalData / limit);
        const pageSize = Number(limit);

        if (data.length === 0) {
            HttpResponseTraits.dataNotFound();
        }

        return {
            status: 'success',
            message: 'Success get all data',
            data,
            currentPage: Number(page),
            totalPage: totalPage,
            pageSize: pageSize,
            totalData: totalData,
            nextPage: page < totalPage ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
    }

    async createData(productDto: ProductDto, productImg: Express.Multer.File): Promise<any> {
        try {
            const { name_product, stock, price, description } = productDto;

            if (!productImg || !['image/jpeg', 'image/png'].includes(productImg.mimetype)) {
                throw new UnprocessableEntityException({
                    status: 'not validate',
                    message: [
                        {
                            field: 'product_img',
                            error: 'Product_img is required and must be a JPEG or PNG image',
                        },
                    ],
                });
            }

            const filename = `${uuidv4()}-${productImg.originalname}`;
            const path = `./public/uploads/product/${filename}`;
            const writeStream = createWriteStream(path);

            const fileUploadPromise = new Promise((resolve, reject) => {
                writeStream.on('finish', () => resolve(true));
                writeStream.on('error', (err) => reject(err));
                writeStream.write(productImg.buffer);
                writeStream.end();
            })

            await fileUploadPromise;

            const data = await this.prisma.product.create({
                data: {
                    name_product,
                    stock: Number(stock),
                    price: Number(price),
                    description,
                    product_img: filename
                }
            });

            return HttpResponseTraits.success(data, 'Success create product');
        } catch (error) {
            console.log(error);
            if (error instanceof UnprocessableEntityException) {
                throw error;
            }
        };
    }

    async getDataById(id: string): Promise<any> {
        try {
            const data = await this.prisma.product.findUnique({
                where: {
                    id: id
                }
            });

            if (!data) {
                HttpResponseTraits.dataNotFound();
            }

            return HttpResponseTraits.success(data, 'Success get data by id');
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
        };
    }

    async updateData(id: string, productDto: ProductDto, productImg: Express.Multer.File): Promise<any> {
        try {
            const { name_product, stock, price, description } = productDto;
            if (!productImg || !['image/jpeg', 'image/png'].includes(productImg.mimetype)) {
                throw new UnprocessableEntityException({
                    status: 'not validate',
                    message: [
                        {
                            field: 'product_img',
                            error: 'Product_img is required and must be a JPEG or PNG image',
                        },
                    ],
                });
            }

            const data = await this.prisma.product.findUnique({
                where: {
                    id: id
                }
            })

            if (!data) {
                HttpResponseTraits.dataNotFound();
            }

            const filename = `${uuidv4()}-${productImg.originalname}`;
            const path = `./public/uploads/product/${filename}`;
            const writeStream = createWriteStream(path)
            const oldFile = `./public/uploads/product/${data.product_img}`;

            if (fs.existsSync(oldFile)) {
                fs.unlinkSync(oldFile);
            }

            const fileUploadPromise = new Promise((resolve, reject) => {
                writeStream.on('finish', () => resolve(true));
                writeStream.on('error', (err) => reject(err));
                writeStream.write(productImg.buffer);
                writeStream.end();
            })

            await fileUploadPromise;

            const updatedData = await this.prisma.product.update({
                where: {
                    id: id
                },
                data: {
                    name_product,
                    stock: Number(stock),
                    price: Number(price),
                    description,
                    product_img: filename
                }
            });

            return HttpResponseTraits.success(updatedData, 'Success update product');
        } catch (error) {
            console.log(error);
            if (error instanceof UnprocessableEntityException) {
                throw error;
            } else if (error instanceof NotFoundException) {
                throw error;
            }
        };

    }

    async deleteData(id: string): Promise<any> {
        try {
            const data = await this.prisma.product.findUnique({
                where: {
                    id: id
                }
            });

            if (!data) {
                HttpResponseTraits.dataNotFound();
            }

            const file = `./public/uploads/product/${data.product_img}`;

            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }

            await this.prisma.product.delete({
                where: {
                    id: id
                }
            });

            return HttpResponseTraits.delete();
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
        };
    }
}
