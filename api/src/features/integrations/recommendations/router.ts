import PromiseRouter from 'express-promise-router';
import {
    recommendItems,
    recommendItemsForUser,
    recommendSimilarItems,
    recommendTopicsForUser,
    Topic,
} from './requests';

export const recommendationsRouter = PromiseRouter();

recommendationsRouter.get<{ userId: string }, Topic[]>('/topics/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const topics = await recommendTopicsForUser(req.schema, userId);
    return res.json(topics);
});

recommendationsRouter.get<{ model: string; itemId: string }>('/:model/items', async (req, res) => {
    const { model } = req.params;
    const recommendations = await recommendItems(req.schema, model, req.query as Record<string, string>);
    return res.json(recommendations);
});

recommendationsRouter.get<{ model: string; itemId: string }>('/:model/items/:itemId/items', async (req, res) => {
    const { model, itemId } = req.params;
    const recommendations = await recommendSimilarItems(req.schema, model, itemId, req.query as Record<string, string>);
    return res.json(recommendations);
});

recommendationsRouter.get<{ model: string; userId: string }>('/:model/users/:userId/items', async (req, res) => {
    const { model, userId } = req.params;
    const recommendations = await recommendItemsForUser(req.schema, model, userId, req.query as Record<string, string>);
    return res.json(recommendations);
});
