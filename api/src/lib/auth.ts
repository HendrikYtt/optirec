import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from './errors';
import { TokenPayload, verifyToken } from './jwt';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const protect = () => (req: Request<any>, res: Response, next: NextFunction) => {
    const [, token] = req.headers.authorization?.split(' ') ?? [];
    if (!token) {
        throw new ForbiddenError();
    }
    try {
        const id = verifyToken(token);
        req.account = id;
        next();
    } catch (err) {
        throw new UnauthorizedError((err as JsonWebTokenError).message);
    }
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            apiKey: string;
            account: TokenPayload;
        }
    }
}
