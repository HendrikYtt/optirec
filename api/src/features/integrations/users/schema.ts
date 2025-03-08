import { IsObject, IsString } from 'class-validator';

export class UserRequestSchema {
    @IsString()
    id: string;

    @IsObject()
    attributes: Record<string, string>;
}
