import { IsObject, IsString } from 'class-validator';

export class ItemRequestSchema {
    @IsString()
    id: string;

    @IsObject()
    attributes: Record<string, string>;
}
