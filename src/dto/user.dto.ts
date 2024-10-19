import { IsNotEmpty, IsNumber, Length, Matches} from "class-validator";
import { File } from "buffer";

export class UserDto {
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
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    @Matches(/^\d+$/, {
        message: 'Phone number must contain only numbers.'
    })
    phone_number: string
}