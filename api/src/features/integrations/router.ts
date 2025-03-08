import PromiseRouter from 'express-promise-router';
import { Application as App } from '../applications/model';
import { getApplicationByApiKey } from '../applications/service';
import { interactionsRouter } from './interactions/router';
import { itemsRouter } from './items/router';
import { recommendationsRouter } from './recommendations/router';
import { usersRouter } from './users/router';

export const integrationsRouter = PromiseRouter();

integrationsRouter.use(async (req, _res, next) => {
    req.application = await getApplicationByApiKey(req);
    req.schema = `apps_${req.application.id}`;
    return next();
});

integrationsRouter.use('/users', usersRouter);
integrationsRouter.use('/items', itemsRouter);
integrationsRouter.use('/interactions', interactionsRouter);
integrationsRouter.use('/recommendations', recommendationsRouter);

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            application: App;
            schema: string;
        }
    }
}
