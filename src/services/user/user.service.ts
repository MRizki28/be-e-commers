import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HttpResponseTraits } from 'src/traits/HttpResponseTrait';
import { UserDto } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
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

        const data = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            skip,
            take: Number(limit)
        });

        const totalData = await this.prisma.user.count({
            where: {
                OR: [
                    {
                        email: {
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

    async createData(userDto: UserDto): Promise<any> {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: userDto.email }
            });

            if (existingUser) {
                throw new UnprocessableEntityException({
                    status: 'not validate',
                    message: {
                        field: 'email',
                        error: 'Email already exists',
                    },
                })
            }

            const { email, password } = userDto;
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password,
                    role: 'USER',
                }
            })

            return HttpResponseTraits.success(user, 'success', 201);
        } catch (error) {
            console.log(error);
            if (error instanceof UnprocessableEntityException) {
                throw error;
            }
        };

    }

    async getDataById(id: string): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: id }
            });

            if (!user) {
                HttpResponseTraits.dataNotFound();
            }

            return HttpResponseTraits.success(user);
        } catch (error) {
            console.log(error);
            if(error instanceof NotFoundException) {
                throw error;
            }
        };
        
    }

    async updateData(id: string, userDto: UserDto): Promise<any> {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { id: id }
            });

            if (!existingUser) {
                HttpResponseTraits.dataNotFound();
            }


            const { email, password } = userDto;

            const userWithEmail = await this.prisma.user.findUnique({
                where: { email }
            });
    
            if (userWithEmail && userWithEmail.id !== id) {
                HttpResponseTraits.errorMessage({
                    field: "email",
                    error: "Email already in use by another user."
                });
            }

            const user = await this.prisma.user.update({
                where: { id: id },
                data: {
                    email,
                    password,
                }
            });

            return HttpResponseTraits.success(user, 'success', 200);
        } catch (error) {
            console.log(error);
            if(error instanceof NotFoundException) {
                throw error;
            }else if(error instanceof UnprocessableEntityException) {
                throw error;
            }
        };
    }

    async deleteData(id: string): Promise<any> {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { id: id }
            });

            if (!existingUser) {
                HttpResponseTraits.dataNotFound();
            }

            await this.prisma.user.delete({
                where: { id: id }
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
