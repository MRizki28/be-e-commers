import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Request } from 'express';
import { HttpResponseTraits } from 'src/traits/HttpResponseTrait';

interface User {
    userId: string;
}
@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createOrder(req: Request & { user: User }): Promise<any> {
        console.log(req.user.id)
        try {
            const cartItem = await this.prisma.cart.findMany({
                where: {
                    id_user: req.user.id
                },
                include: {
                    product: true
                }
            })

            if (cartItem.length === 0) {
                return HttpResponseTraits.dataNotFound()
            }

            let totalAmount: number = 0

            cartItem.forEach(item => {
                const price: number = Number(item.product.price);
                totalAmount += item.qty * price;
            })

            console.log('Creating order with data:', {
                id_user: req.user.id,
                total_amount: totalAmount,
                product_order: cartItem.map(item => ({
                    id_product: item.id_product,
                    qty: item.qty,
                    price: item.product.price,
                }))
            });


            const order = await this.prisma.order.create({
                data: {
                    id_user: req.user.id,
                    total_amount: totalAmount,
                    product_order: cartItem.map(item => ({
                        id_product: item.id_product,
                        qty: item.qty,
                        price: item.product.price,
                    }))
                }
            })


            await this.prisma.cart.deleteMany({
                where: {
                    id_user: req.user.id
                }
            })

            return HttpResponseTraits.success(order, 'Order created successfully');
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
        };

    }

    async getAllOrder(req: Request & { user: User }): Promise<any> {
        try {
            const data = await this.prisma.order.findMany({
                where: {
                    id_user: req.user.id
                },
                select: {
                    product_order: true,
                }
            })

            if (data.length === 0) {
                return HttpResponseTraits.dataNotFound()
            }

            const orderData = data.map(item => ({
                product_order: item.product_order
            }))

            return HttpResponseTraits.success(orderData, 'Success get all order');
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
        };
    }
}
