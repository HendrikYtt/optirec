import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.createTable('sessions', (t) => {
        t.increments('id').primary();
        t.integer('account_id').notNullable().references('accounts.id');
        t.text('refresh_token').notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
        t.timestamp('expires_at').notNullable();
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTable('sessions');
};
