import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HttpResponseTraits } from 'src/traits/HttpResponseTrait';

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
}
