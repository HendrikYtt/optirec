import { knex } from '../../../connections/knex';
import { Item } from './model';

export const getItemById = async (schema: string, id: string) => {
    return knex('items').withSchema(schema).where({ id }).first();
};

export const upsertItem = async (schema: string, item: Omit<Item, 'created_at'>) => {
    const [result] = await knex('items').withSchema(schema).insert(item).onConflict(['id']).merge().returning('*');
    return result;
};
