import { Injectable } from "@nestjs/common";
import { IsNotEmpty, Validate } from "class-validator";
import { FileUpload } from "src/config/validator/FIleUpload";

@Injectable()
export class ProductDto {
    @IsNotEmpty()
    name_product: string;
    @IsNotEmpty()
    stock: number;
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    description: string;
    // @IsNotEmpty()
    // @Validate(FileUpload)
    product_img: string;
}