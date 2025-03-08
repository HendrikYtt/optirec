import PromiseRouter from 'express-promise-router';
import { ApplicationError } from '../../constants/errors';
import { protect } from '../../lib/auth';
import { ForbiddenError } from '../../lib/errors';
import { validateBody } from '../../lib/validator';
import { interactionsRouter } from './interactions/router';
import { itemsRouter } from './items/router';
import { Application, ApplicationKey } from './model';
import { CreateApplicationSchema, UpdateApplicationKeySchema } from './schema';
import {
    createApplication,
    createApplicationKey,
    deleteApplicationKeyOrThrow,
    getApplicationKeysByApplicationId,
    getApplicationsByAccountId,
    getUserApplicationOrThrow,
    updateApplicationKeyById,
} from './service';
import { usersRouter } from './users/router';

export const applicationsRouter = PromiseRouter();

applicationsRouter.use(itemsRouter);
applicationsRouter.use(usersRouter);
applicationsRouter.use(interactionsRouter);

applicationsRouter.get<{ id: string }, Application>('/:id(\\d+)', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    return res.json(application);
});

applicationsRouter.post<unknown, unknown, CreateApplicationSchema>('/', protect(), async (req, res) => {
    const application = await createApplication(req.body, req.account.sub);
    return res.json(application);
});

applicationsRouter.post<{ applicationId: string }>('/:applicationId(\\d+)/keys', protect(), async (req, res) => {
    const { applicationId } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(applicationId));
    const applicationKey = await createApplicationKey(application.id);
    return res.json(applicationKey);
});

applicationsRouter.get<unknown, Application[]>('/', protect(), async (req, res) => {
    const application = await getApplicationsByAccountId(req.account.sub);
    return res.json(application);
});

applicationsRouter.get<{ id: string }, ApplicationKey[]>('/:id(\\d+)/keys', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const apiKeys = await getApplicationKeysByApplicationId(application.id);
    return res.json(apiKeys);
});

applicationsRouter.delete<{ id: string }, ApplicationKey>('/keys/:id(\\d+)', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const apiKey = await deleteApplicationKeyOrThrow(application.id);
    return res.json(apiKey);
});

applicationsRouter.put<{ id: string }, ApplicationKey, UpdateApplicationKeySchema>(
    '/keys/:id(\\d+)',
    protect(),
    validateBody(UpdateApplicationKeySchema),
    async (req, res) => {
        const { id } = req.params;
        const { last_used_at } = req.body;
        const lastUsedAt = new Date(last_used_at);
        if (lastUsedAt.toString() === 'Invalid Date') {
            throw new ForbiddenError(ApplicationError.InvalidLastUsedAt);
        }
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
        const applicationKey = await updateApplicationKeyById(application.id, lastUsedAt);
        return res.json(applicationKey);
    },
);
