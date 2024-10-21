import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { RoleGuard } from 'src/common/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/services/prisma.service';


@Module({
  imports: [UserModule, AuthModule, ProductModule, CartModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: RoleGuard
  }],
})
export class AppModule { }
