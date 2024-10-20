import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';


@Module({
  imports: [UserModule, AuthModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
