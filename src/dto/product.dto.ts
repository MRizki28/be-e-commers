import { Injectable } from "@nestjs/common";
import { IsDecimal, IsNotEmpty, IsNumberString, Validate } from "class-validator";
import { FileUpload } from "src/config/validator/FIleUpload";

@Injectable()
export class ProductDto {
    @IsNotEmpty()
    name_product: string;
    @IsNotEmpty()
    stock: number;
    @IsNotEmpty()
    @IsDecimal({decimal_digits: '2'})
    price: number;
    @IsNotEmpty()
    description: string;
    // @IsNotEmpty()
    // @Validate(FileUpload)
    product_img: string;
}