import { publish } from '../../../connections/rabbit';
import { User } from './model';
import { upsertUser } from './repository';

export const addUser = async (schema: string, data: Omit<User, 'created_at'>) => {
    const user = await upsertUser(schema, data);
    await publish(`${schema}.users`, user);
    return user;
};
