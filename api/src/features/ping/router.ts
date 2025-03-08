import PromiseRouter from 'express-promise-router';
import { knex } from '../../connections/knex';

export const pingRouter = PromiseRouter();

pingRouter.get('/', async (req, res) => {
    await knex.raw('SELECT 1');
    return res.json({ message: 'pong' });
});
