import { publish } from '../../../connections/rabbit';
import { Interaction } from './model';
import { upsertInteraction } from './repository';

export const addInteraction = async (schema: string, data: Omit<Interaction, 'created_at'>) => {
    const interaction = await upsertInteraction(schema, data);
    await publish(`${schema}.interactions`, interaction);
    return interaction;
};
