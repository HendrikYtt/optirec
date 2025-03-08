import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from './errors';

const makeValidator =
    (getter: (req: Request) => unknown) =>
    <T>(schema: ClassConstructor<T>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (req: Request<any>, res: Response, next: NextFunction) => {
        const body = plainToInstance(schema, getter(req));
        const errors = await validate(body as object, { forbidUnknownValues: true });
        if (errors.length) {
            throw new BadRequestError('ValidationError', errors);
        }
        return next();
    };

export const validateBody = makeValidator((req) => req.body);
export const validateQuery = makeValidator((req) => req.query);
