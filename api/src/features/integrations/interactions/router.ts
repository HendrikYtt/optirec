import PromiseRouter from 'express-promise-router';
import { validateBody } from '../../../lib/validator';
import { findApplicationInteractionProperties } from '../../applications/interactions/database';
import { validateAttributes } from '../service';
import { Interaction } from './model';
import { findInteractions } from './repository';
import { InteractionRequestSchema } from './schema';
import { addInteraction } from './service';

export const interactionsRouter = PromiseRouter();

interactionsRouter.get<{ id: string }, Interaction[], undefined, { userId: string; limit?: string }>(
    '/',
    async (req, res) => {
        const interactions = await findInteractions(
            req.schema,
            { user_id: req.query.userId },
            parseInt(req.query?.limit ?? '10'),
        );
        return res.json(interactions);
    },
);

interactionsRouter.post<unknown, unknown, InteractionRequestSchema>(
    '/',
    validateBody(InteractionRequestSchema),
    async (req, res) => {
        const properties = await findApplicationInteractionProperties(req.application.id);
        validateAttributes(req.body.attributes, properties);
        const interaction = await addInteraction(req.schema, req.body);
        return res.json(interaction);
    },
);
