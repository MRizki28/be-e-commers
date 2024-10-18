import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ async: true })
@Injectable()
export class FileUpload implements ValidatorConstraintInterface {
    validate(file: any) {
        console.log('File:', file);
        return file && Object.keys(file).length > 0;
    }

    defaultMessage() {
        return 'File harus diupload';
    }
}