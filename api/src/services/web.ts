import PromiseRouter from 'express-promise-router';
import { knex, migrate } from '../connections/knex';
import { apiExchange, rabbit } from '../connections/rabbit';
import { applicationsRouter } from '../features/applications/router';
import { authRouter } from '../features/auth/router';
import { demoRouter } from '../features/demo/router';
import { pingRouter } from '../features/ping/router';
import { stripeRouter } from '../features/stripe/router';
import { createApi } from '../lib/express';
import { log } from '../lib/log';

const router = PromiseRouter();
router.use('/ping', pingRouter);
router.use('/auth', authRouter);
router.use('/applications', applicationsRouter);
router.use('/demo', demoRouter);
router.use('/stripe', stripeRouter);

export const { app, listen } = createApi({ router });

export const start = async () => {
    await rabbit.exchange(apiExchange).setup();
    await migrate();

    const app = listen();

    process.once('SIGTERM', async () => {
        log.info('SIGTERM received, shutting down gracefully');
        await app.close();
        await rabbit.close();
        await knex.destroy();
    });
};
