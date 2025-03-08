import PromiseRouter from 'express-promise-router';
import { validateBody } from '../../../lib/validator';
import { findApplicationUserProperties } from '../../applications/users/database';
import { validateAttributes } from '../service';
import { findUsers } from './repository';
import { UserRequestSchema } from './schema';
import { addUser } from './service';

export const usersRouter = PromiseRouter();

usersRouter.get('/', async (req, res) => {
    const users = await findUsers(req.schema);
    return res.json(users);
});

usersRouter.post<unknown, unknown, UserRequestSchema>('/', validateBody(UserRequestSchema), async (req, res) => {
    const properties = await findApplicationUserProperties(req.application.id);
    validateAttributes(req.body.attributes, properties);
    const user = await addUser(req.schema, req.body);
    return res.json(user);
});
