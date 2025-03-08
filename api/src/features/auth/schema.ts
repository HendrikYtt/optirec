import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestSchema {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class RegisterRequestSchema {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export type AccountResponseSchema = {
    email: string;
};

export type RenewAccessResponseSchema = {
    access_token: string;
};

export class ChangePasswordRequestSchema {
    @IsString()
    old_password: string;

    @IsString()
    @MinLength(8)
    new_password: string;
}
