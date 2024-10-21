import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationError: ValidationError[] = []) => {
      return new UnprocessableEntityException({
        status: 'not validate',
        message: validationError.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints).join(', '),
        })),
      });
    }
  }
  ));

  app.use(bodyParser.json());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
