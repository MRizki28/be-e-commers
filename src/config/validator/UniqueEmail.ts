import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "src/services/prisma.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueEmail implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {} // Menyuntikkan PrismaService

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        console.log('Validating email:', value);
        const id = args.object['id']; // Ambil id dari objek

        try {
            if (id) {
                // Cari pengguna berdasarkan email dan pastikan ID tidak sama
                const user = await this.prisma.user.findFirst({
                    where: {
                        email: value,
                        id: { not: id } // Pastikan ID tidak sama
                    }
                });
                return !user; // Jika user ditemukan, return false
            } else {
                const user = await this.prisma.user.findUnique({
                    where: { email: value }
                });
                return !user; // Jika user ditemukan, return false
            }
        } catch (error) {
            console.error('Error checking email uniqueness:', error);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        return 'Email $value already exists, please use another email';
    }
}
