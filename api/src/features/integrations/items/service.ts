import { publish } from '../../../connections/rabbit';
import { Item } from './model';
import { upsertItem } from './repository';

export const addItem = async (schema: string, data: Omit<Item, 'created_at'>) => {
    const createdItem = await upsertItem(schema, data);
    await publish(`${schema}.items`, createdItem);
    return createdItem;
};
