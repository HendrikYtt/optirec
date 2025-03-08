import { createLogger, format, transports } from 'winston';

export const log = createLogger({
    level: 'debug',
    format: format.json(),
    transports: [
        new transports.Console({
            format: format.simple(),
        }),
    ],
});
