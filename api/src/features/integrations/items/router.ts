import PromiseRouter from 'express-promise-router';
import { NotFoundError } from '../../../lib/errors';
import { validateBody } from '../../../lib/validator';
import { findApplicationItemProperties } from '../../applications/items/database';
import { validateAttributes } from '../service';
import { getItemById } from './repository';
import { ItemRequestSchema } from './schema';
import { addItem } from './service';

export const itemsRouter = PromiseRouter();

itemsRouter.get<{ id: string }>('/:id', async (req, res) => {
    const { id } = req.params;
    const item = await getItemById(req.schema, id);
    if (!item) {
        throw new NotFoundError();
    }
    return res.json(item);
});

itemsRouter.post<unknown, unknown, ItemRequestSchema>('/', validateBody(ItemRequestSchema), async (req, res) => {
    const properties = await findApplicationItemProperties(req.application.id);
    validateAttributes(req.body.attributes, properties);
    const item = await addItem(req.schema, req.body);
    return res.json(item);
});
