import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.alterTable('application_keys', (t) => {
        t.timestamp('last_used_at');
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.alterTable('application_keys', (t) => {
        t.dropColumn('last_used_at');
    });
};
