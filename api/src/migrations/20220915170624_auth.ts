import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.createTable('users', (t) => {
        t.increments('id').primary();
        t.text('email').notNullable().unique();
        t.text('password').notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('user_login_history', (t) => {
        t.increments('id').primary();
        t.integer('user_id').notNullable().references('users.id');
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTable('user_login_history');
    await knex.schema.dropTable('users');
};
