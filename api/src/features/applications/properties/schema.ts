import { IsEnum, IsString } from 'class-validator';
import { PropertyType } from './model';

export class CreatePropertySchema {
    @IsString()
    name: string;

    @IsEnum(PropertyType)
    type: PropertyType;
}
