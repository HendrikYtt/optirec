import { IsString, IsISO8601 } from 'class-validator';

export class CreateApplicationSchema {
    @IsString()
    name: string;
}

export class UpdateApplicationKeySchema {
    @IsString()
    @IsISO8601()
    last_used_at: string;
}
