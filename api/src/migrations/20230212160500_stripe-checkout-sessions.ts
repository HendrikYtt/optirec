import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.createTable('stripe_checkout_sessions', (t) => {
        t.increments('id');
        t.integer('account_id').notNullable().references('id').inTable('accounts').onDelete('CASCADE');
        t.text('session_id').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('stripe_customers', (t) => {
        t.increments('id');
        t.integer('account_id').notNullable().references('id').inTable('accounts').onDelete('CASCADE');
        t.text('customer_id').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTable('stripe_checkout_sessions');
    await knex.schema.dropTable('stripe_customers');
};
