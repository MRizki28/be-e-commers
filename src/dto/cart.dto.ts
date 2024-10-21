import { Injectable } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class CartDto {
    @IsNotEmpty()
    id_product: string;
    @IsNotEmpty()
    qty: number;
}