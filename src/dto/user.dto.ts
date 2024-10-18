import { isNotEmpty, IsNotEmpty, validate, Validate } from "class-validator";
import { UniqueEmail } from "src/config/validator/UniqueEmail";
import { File } from "buffer";
// import { idIsSame } from "src/config/validator/IdIsSame";

export class UserDto {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
}