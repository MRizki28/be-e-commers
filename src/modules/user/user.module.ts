import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from 'src/controllers/user/user.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/services/user/user.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, PrismaService],
})
export class UserModule {}
