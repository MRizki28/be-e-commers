import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ async: true })
@Injectable()
export class FileUpload implements ValidatorConstraintInterface {
    
    // Fungsi validate untuk memeriksa apakah file valid
    validate(file: any, args: ValidationArguments) {
        console.log('File:', file);

        // Cek apakah file ada dan memiliki properti yang diharapkan
        return file && Object.keys(file).length > 0 && this.isValidMimeType(file.mimetype);
    }

    // Fungsi tambahan untuk memvalidasi mime type
    isValidMimeType(mimeType: string) {
        // Hanya izinkan JPEG dan PNG
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        return allowedMimeTypes.includes(mimeType);
    }

    // Pesan default jika validasi gagal
    defaultMessage(args: ValidationArguments) {
        return 'File harus diupload dan harus berupa gambar JPEG atau PNG';
    }
}
