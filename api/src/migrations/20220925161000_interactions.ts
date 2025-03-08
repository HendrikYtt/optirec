import { Knex } from 'knex';

export const up = async (knex: Knex) => {
    await knex.schema.createSchema('client_test');

    await knex.schema.withSchema('client_test').createTable('users', (t) => {
        t.text('id').primary();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema('client_test').createTable('items', (t) => {
        t.text('id').primary();
        t.text('title');
        t.text('genres');
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema('client_test').createTable('interactions', (t) => {
        t.bigIncrements('id').primary();
        t.text('user_id').notNullable().references('id').inTable('client_test.users');
        t.text('item_id').notNullable().references('id').inTable('client_test.items');
        t.decimal('rating', 2, 1);
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
};

export const down = async (knex: Knex) => {
    await knex.schema.withSchema('client_test').dropTable('interactions');
    await knex.schema.withSchema('client_test').dropTable('items');
    await knex.schema.withSchema('client_test').dropTable('users');
    await knex.schema.dropSchema('client_test');
};
