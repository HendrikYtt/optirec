import PromiseRouter from 'express-promise-router';
import { knex, migrate } from '../connections/knex';
import { apiExchange, rabbit } from '../connections/rabbit';
import { integrationsRouter } from '../features/integrations/router';
import { pingRouter } from '../features/ping/router';
import { createApi } from '../lib/express';
import { log } from '../lib/log';

const router = PromiseRouter();
router.use('/ping', pingRouter);
router.use(integrationsRouter);

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
