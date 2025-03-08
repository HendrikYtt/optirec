import PromiseRouter from 'express-promise-router';
import { protect } from '../../../lib/auth';
import { NotFoundError } from '../../../lib/errors';
import { validateBody } from '../../../lib/validator';
import { CreatePropertySchema } from '../properties/schema';
import { getUserApplicationOrThrow } from '../service';
import {
    countApplicationUsers,
    deleteApplicationUserPropertyById,
    findApplicationUserProperties,
    findApplicationUsers,
    insertApplicationUserProperty,
} from './database';

export const usersRouter = PromiseRouter();

usersRouter.get<{ id: string }>('/:id(\\d+)/users', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const users = await findApplicationUsers(application.id);
    return res.json(users);
});

usersRouter.get<{ id: string }>('/:id(\\d+)/users/count', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const count = await countApplicationUsers(application.id);
    return res.json({ count });
});

usersRouter.get('/:id(\\d+)/users/properties', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const properties = await findApplicationUserProperties(application.id);
    return res.json(properties);
});

usersRouter.post<{ id: string }>(
    '/:id(\\d+)/users/properties',
    protect(),
    validateBody(CreatePropertySchema),
    async (req, res) => {
        const { id } = req.params;
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
        const property = await insertApplicationUserProperty(application.id, req.body);
        return res.json(property);
    },
);

usersRouter.delete<{ applicationId: string; id: string }>(
    '/:applicationId(\\d+)/users/properties/:id(\\d+)',
    protect(),
    async (req, res) => {
        const { applicationId, id } = req.params;
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(applicationId));
        const count = await deleteApplicationUserPropertyById(application.id, parseInt(id));
        if (!count) {
            throw new NotFoundError('Property not found');
        }
        return res.sendStatus(204);
    },
);
