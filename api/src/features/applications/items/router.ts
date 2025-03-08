import PromiseRouter from 'express-promise-router';
import { protect } from '../../../lib/auth';
import { NotFoundError } from '../../../lib/errors';
import { validateBody } from '../../../lib/validator';
import { CreatePropertySchema } from '../properties/schema';
import { getUserApplicationOrThrow } from '../service';
import {
    countApplicationItems,
    deleteApplicationItemPropertyById,
    findApplicationItemProperties,
    findApplicationItems,
    insertApplicationItemProperty,
} from './database';

export const itemsRouter = PromiseRouter();

itemsRouter.get<{ id: string }>('/:id(\\d+)/items', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const items = await findApplicationItems(application.id);
    return res.json(items);
});

itemsRouter.get<{ id: string }>('/:id(\\d+)/items/count', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const count = await countApplicationItems(application.id);
    return res.json({ count });
});

itemsRouter.get('/:id(\\d+)/items/properties', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const properties = await findApplicationItemProperties(application.id);
    return res.json(properties);
});

itemsRouter.post<{ id: string }>(
    '/:id(\\d+)/items/properties',
    protect(),
    validateBody(CreatePropertySchema),
    async (req, res) => {
        const { id } = req.params;
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
        const property = await insertApplicationItemProperty(application.id, req.body);
        return res.json(property);
    },
);

itemsRouter.delete<{ applicationId: string; id: string }>(
    '/:applicationId(\\d+)/items/properties/:id(\\d+)',
    protect(),
    async (req, res) => {
        const { applicationId, id } = req.params;
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(applicationId));
        const count = await deleteApplicationItemPropertyById(application.id, parseInt(id));
        if (!count) {
            throw new NotFoundError('Property not found');
        }
        return res.sendStatus(204);
    },
);
