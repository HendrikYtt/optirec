import { knex } from '../../../connections/knex';
import { Interaction } from './model';

export const findInteractions = async (schema: string, where: Partial<Interaction>, limit: number) => {
    return knex('interactions').withSchema(schema).where(where).orderBy('created_at', 'desc').limit(limit);
};

export const upsertInteraction = async (schema: string, interaction: Omit<Interaction, 'created_at'>) => {
    const [result] = await knex('interactions')
        .withSchema(schema)
        .insert(interaction)
        .onConflict(['id'])
        .merge()
        .returning('*');
    return result;
};
