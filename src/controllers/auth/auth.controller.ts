import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/config/jwt/jwtAuth.guard';
import { AuthDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/login')
    async login(@Body() authDto: AuthDto) {
        return await this.authService.login(authDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async logout(@Req() req){
        const userId = req.user.userId;
        console.log('User ID:', userId);
        return await this.authService.logout(userId);
    }

}
