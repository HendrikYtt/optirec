import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('client_test').alterTable('items', (t) => {
        t.dropColumn('genres');
        t.specificType('keywords', 'text[]').notNullable().defaultTo('{}');
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('client_test').alterTable('items', (t) => {
        t.dropColumn('keywords');
        t.text('genres');
    });
};
