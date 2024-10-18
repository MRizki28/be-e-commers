import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class idIsSame implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        console.log(args)
        const paramId = args.object['id']; 
        return value === paramId; 
    }

    defaultMessage(args: ValidationArguments) {
        console.log('disini')
        return `ID yang diinputkan (${args.object['id']}) harus sama dengan parameter ID: ${args.value}`;
    }
}
