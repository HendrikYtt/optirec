import PromiseRouter from 'express-promise-router';
import { protect } from '../../../lib/auth';
import { NotFoundError } from '../../../lib/errors';
import { validateBody } from '../../../lib/validator';
import { CreatePropertySchema } from '../properties/schema';
import { getUserApplicationOrThrow } from '../service';
import {
    countApplicationInteractions,
    deleteApplicationInteractionPropertyById,
    findApplicationInteractionProperties,
    findApplicationInteractions,
    insertApplicationInteractionProperty,
} from './database';

export const interactionsRouter = PromiseRouter();

interactionsRouter.get<{ id: string }>('/:id(\\d+)/interactions', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const interactions = await findApplicationInteractions(application.id);
    return res.json(interactions);
});

interactionsRouter.get<{ id: string }>('/:id(\\d+)/interactions/count', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const count = await countApplicationInteractions(application.id);
    return res.json({ count });
});

interactionsRouter.get('/:id(\\d+)/interactions/properties', protect(), async (req, res) => {
    const { id } = req.params;
    const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
    const properties = await findApplicationInteractionProperties(application.id);
    return res.json(properties);
});

interactionsRouter.post<{ id: string }>(
    '/:id(\\d+)/interactions/properties',
    protect(),
    validateBody(CreatePropertySchema),
    async (req, res) => {
        const { id } = req.params;
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(id));
        const property = await insertApplicationInteractionProperty(application.id, req.body);
        return res.json(property);
    },
);

interactionsRouter.delete<{ applicationId: string; id: string }>(
    '/:applicationId(\\d+)/interactions/properties/:id(\\d+)',
    protect(),
    async (req, res) => {
        const { applicationId, id } = req.params;
        const application = await getUserApplicationOrThrow(req.account.sub, parseInt(applicationId));
        const count = await deleteApplicationInteractionPropertyById(application.id, parseInt(id));
        if (!count) {
            throw new NotFoundError('Property not found');
        }
        return res.sendStatus(204);
    },
);
