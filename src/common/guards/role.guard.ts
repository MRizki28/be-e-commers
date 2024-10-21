import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];

        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header not found');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            console.log('JWT Payload:', payload);
            
            const userRole = payload.role;


            if (!roles.includes(userRole)) {
                throw new ForbiddenException('You do not have permission (Role mismatch)');
            }

            return true;
        } catch (err) {
            console.error('Error in RoleGuard:', err);
            if (err instanceof ForbiddenException) {
                throw err;
            }
        }
    }
}
