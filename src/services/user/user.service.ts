import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HttpResponseTraits } from 'src/traits/HttpResponseTrait';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
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
                    },
                    {
                        profile: {
                            name: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            address: {
                                contains: search,
                                mode: 'insensitive'
                            },
                            phone_number: {
                                contains: search,
                                mode: 'insensitive'
                            },
                        },
                    }
                ]
            },
            include: {
                profile: true
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
            return this.prisma.$transaction(async (prisma) => {
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
                const { email, password, name, address, phone_number } = userDto;

                const hashPassword = await bcrypt.hash(password, 10);

                const user = await this.prisma.user.create({
                    data: {
                        email,
                        password: hashPassword,
                        role: 'USER',
                    }
                })

                const profile = await this.prisma.profile.create({
                    data: {
                        id_user: user.id,
                        name,
                        address,
                        phone_number,
                    }
                })

                return HttpResponseTraits.success({
                    user,
                    profile
                });
            })

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
            if (error instanceof NotFoundException) {
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

            const { email, password, name, address, phone_number } = userDto;

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

            const profile = await this.prisma.profile.update({
                where: { id_user: id },
                data: {
                    name,
                    address,
                    phone_number,
                }
            })

            return HttpResponseTraits.success({
                user,
                profile
            });
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            } else if (error instanceof UnprocessableEntityException) {
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

            await this.prisma.profile.delete({
                where: { id_user: id }
            })

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
