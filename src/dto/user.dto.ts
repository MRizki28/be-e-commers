import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { ValidateIf, ValidationArguments } from "class-validator";
import { Match } from "src/common/decorator/match.decorator";

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
    @Match('password', {
        message: 'Password confirmation does not match the password.'
    })
    passwordConfirmation: string; 
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    @Matches(/^\d+$/, {
        message: 'Phone number must contain only numbers.'
    })
    phone_number: string;
}
