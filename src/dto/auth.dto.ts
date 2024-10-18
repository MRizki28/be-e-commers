import { Injectable } from "@nestjs/common";
import { IsNotEmpty, Length, Matches } from "class-validator";

@Injectable()
export class AuthDto {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @Length(5, 20, {
        message: 'Password must be at least 5 characters long and at most 20 characters long.'
    })
    @Matches(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.'
    })
    password: string;
}