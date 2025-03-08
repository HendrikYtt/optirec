import { knex } from '../../../connections/knex';
import { User } from './model';

export const findUsers = async (schema: string) => {
    return knex('users').withSchema(schema);
};

export const upsertUser = async (schema: string, user: Omit<User, 'created_at'>) => {
    const [result] = await knex('users').withSchema(schema).insert(user).onConflict(['id']).merge().returning('*');
    return result;
};
