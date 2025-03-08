import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.renameTable('users', 'accounts');
    await knex.schema.renameTable('user_login_history', 'account_login_history');
    await knex.schema.alterTable('account_login_history', (t) => {
        t.renameColumn('user_id', 'account_id');
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.renameTable('accounts', 'users');
    await knex.schema.renameTable('account_login_history', 'user_login_history');
    await knex.schema.alterTable('user_login_history', (t) => {
        t.renameColumn('account_id', 'user_id');
    });
};
