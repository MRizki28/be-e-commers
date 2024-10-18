import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/services/prisma.service";
// Import PrismaService untuk akses database
import { Request } from "express";

// Extend the Request interface to include the user property
declare module 'express' {
    interface Request {
        user?: any;
    }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers['authorization'].split(' ')[1];
        console.log(token);

        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.id },
            });

            if (!user || user.token_access !== token) { 
                throw new UnauthorizedException('Token is invalid or has been logged out');
            }

            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token is invalid');
        }
    }
}
