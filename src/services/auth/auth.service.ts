import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ){}

    async login(authDto: AuthDto): Promise<any> {
        try {
            const { email, password } = authDto;
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email,
                }
            });
    
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Unauthorized');
            }
    
            const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    token_access: token,
                }
            })
    
            return {
                message: 'Login success',
                token: token,
            }
        } catch (error) {
            console.log(error);
            if(error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Unauthorized');
            }
        };
    }

    async logout(id: string): Promise<any> {
        try {
            await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    token_access: null,
                }
            });
    
            return {
                message: 'Logout success',
            }
        } catch (error) {
            console.log(error);
            if(error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Unauthorized');
            }
        };
    }
}
