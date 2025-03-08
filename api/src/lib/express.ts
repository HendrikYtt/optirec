import cors from 'cors';
import express, { json, NextFunction, Request, Response, Router } from 'express';
import instrumentExpress from 'express-prom-bundle';
import { logger } from 'express-winston';
import { BaseError } from './errors';
import { log } from './log';

const { API_PORT = '3000', ORIGIN = '*' } = process.env;

export type CreateApiOptions = {
    router: Router;
};

export const createApi = ({ router }: CreateApiOptions) => {
    const app = express();
    app.use(
        instrumentExpress({
            includeMethod: true,
            includePath: true,
        }),
    );
    app.use(cors({ origin: ORIGIN.split(',') }));
    app.use(expressLogger);
    app.use(json({ limit: '10mb' }));
    app.use(router);
    app.use(baseErrorHandler);

    const listen = () => {
        const port = parseInt(API_PORT);
        const server = app.listen(port, () => log.info(`Express listening on port ${port}`));

        const close = () =>
            new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));

        return { close };
    };

    return { app, listen };
};

const expressLogger = logger({
    winstonInstance: log,
    expressFormat: true,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if (!(err instanceof BaseError)) {
        log.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        return res.status(500).json({ message: 'InternalServerError' });
    }
    return res.status(err.status).json({ message: err.message, details: err.details });
};
