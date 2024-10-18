import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from 'src/controllers/user/user.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/services/user/user.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '1d'
            }
        })
    ],
    controllers: [UserController],
    providers: [UserService, PrismaService],
})
export class UserModule {}
