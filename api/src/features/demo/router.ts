import PromiseRouter from 'express-promise-router';
import { MODELS_HOST, PLAYGROUND_APP_ID } from '../../config';
import { knex } from '../../connections/knex';
import { http } from '../../lib/rest';

export const demoRouter = PromiseRouter();

demoRouter.get('/items', async (req, res) => {
    const items = await knex(`apps_${PLAYGROUND_APP_ID}.items`).orderBy('created_at', 'desc');
    return res.json(items);
});

demoRouter.get('/popular', async (req, res) => {
    const fetch = await getDemoFetch();
    const recommendations = await fetch.get(`/schemas/apps_${PLAYGROUND_APP_ID}/models/popularity/items?limit=50`);
    return res.json(recommendations);
});

demoRouter.get('/rating', async (req, res) => {
    const fetch = await getDemoFetch();
    const recommendations = await fetch.get(`/schemas/apps_${PLAYGROUND_APP_ID}/models/rating/items?limit=50`);
    return res.json(recommendations);
});

demoRouter.post('/playground', async (req, res) => {
    const fetch = await getDemoFetch();
    const recommendations = await fetch.post(`/schemas/apps_${PLAYGROUND_APP_ID}/playground`, req.body);
    return res.json(recommendations);
});

const getDemoFetch = async () => {
    const { key } = (await knex('application_keys').where('application_id', PLAYGROUND_APP_ID).first()) || {};
    return http.setBaseUrl(MODELS_HOST).setHeader('X-Token', key as string);
};
