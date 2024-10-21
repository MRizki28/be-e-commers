import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartDto } from 'src/dto/cart.dto';
import { HttpResponseTraits } from 'src/traits/HttpResponseTrait';
import { Request } from 'express';

export interface User {
    id: string;
}

@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getDataCartByUser(req: Request & {user: User}): Promise<any> {
        try {
            const data = await this.prisma.cart.findMany({
                where: {
                    id_user: req.user.id
                },
                include: {
                    product: true
                }
            });

            return HttpResponseTraits.success(data, 'Success get data cart');
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error)
        };
    }

    async createData(req: Request & {user: User}, cartDto: CartDto): Promise<any> {
        try {
            const { id_product, qty } = cartDto;
            const id_user = req.user.id;

            const data = await this.prisma.cart.create({
                data: {
                    id_user: id_user,
                    id_product: id_product,
                    qty: Number(qty)
                }
            });

            return HttpResponseTraits.success(data, 'Success add to cart');
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error)
        };
    }

    async updateCart(req: Request & {user: User}, cartDto: CartDto, id: string): Promise<any> {
        console.log(id)
        try {
            const { id_product, qty } = cartDto;
            const cart = await this.prisma.cart.findUnique({
                where: {
                    id: id
                }
            });

            if(req.user.id !== cart.id_user) {
                throw new UnauthorizedException({
                    status: "Unauthorized",
                    message: "You are not authorized to access this cart"
                });
            }

            const data = await this.prisma.cart.update({
                where: {
                    id: id
                },
                data: {
                    id_product: id_product,
                    qty: Number(qty)
                }
            });

            return HttpResponseTraits.success(data, 'Success update cart');
        } catch (error) {
            console.log(error);
            if(error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException(error)
        };
    }

    async deleteCart(req: Request & {user: User}, id: string): Promise<any> {
        try {

            const cart = await this.prisma.cart.findUnique({
                where: {
                    id: id
                }
            });

            if(!cart) {
                return HttpResponseTraits.dataNotFound();
            }

            if(req.user.id !== cart.id_user) {
                throw new UnauthorizedException({
                    status: "Unauthorized",
                    message: "You are not authorized to access this cart"
                });
            }

            const data = await this.prisma.cart.delete({
                where: {
                    id: id
                }
            });

            return HttpResponseTraits.delete();
        } catch (error) {
            console.log(error);
            if(error instanceof UnauthorizedException) {
                throw error;
            }else if(error instanceof NotFoundException) {
                throw error;
            }
        };
        
    }
}
