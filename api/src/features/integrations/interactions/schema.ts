import { IsNumber, IsObject, IsString } from 'class-validator';

export class InteractionRequestSchema {
    @IsString()
    id: string;

    @IsString()
    user_id: string;

    @IsString()
    item_id: string;

    @IsNumber()
    rating: number;

    @IsObject()
    attributes: Record<string, string>;
}
