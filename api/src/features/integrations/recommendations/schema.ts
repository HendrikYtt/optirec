import { IsString } from 'class-validator';

export class UserIdSchema {
    @IsString()
    userId: string;
}
