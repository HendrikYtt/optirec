import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.createTable('applications', (t) => {
        t.increments('id').primary();
        t.integer('account_id').notNullable().references('accounts.id');
        t.text('name').notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('application_keys', (t) => {
        t.increments('id').primary();
        t.integer('application_id').notNullable().references('applications.id');
        t.text('key').notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTable('application_keys');
    await knex.schema.dropTable('applications');
};
