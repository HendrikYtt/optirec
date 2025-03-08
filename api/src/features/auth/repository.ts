import { knex } from '../../connections/knex';
import { Account, AccountLoginHistory, Session } from './model';

export const findAccountById = async (id: number) => {
    return knex<Account>('accounts').where({ id }).first();
};

export const findAccountByEmail = async (email: string) => {
    return knex('accounts').where({ email }).first();
};

export const insertAccount = async (account: Omit<Account, 'id' | 'created_at'>) => {
    const [result] = await knex('accounts').insert(account).returning('*');
    return result;
};

export const updateAccountById = async (id: number, account: Partial<Omit<Account, 'id' | 'created_at'>>) => {
    const [result] = await knex('accounts').where({ id }).update(account).returning('*');
    return result;
};

export const insertAccountLoginHistory = async (history: Omit<AccountLoginHistory, 'id' | 'created_at'>) => {
    await knex('account_login_history').insert(history);
};

export const findSessionByRefreshToken = async (refresh_token: string) => {
    return knex<Session>('sessions').where({ refresh_token }).first();
};

export const insertSession = async (session: Omit<Session, 'id' | 'created_at'>) => {
    const [result] = await knex('sessions').insert(session).returning('*');
    return result;
};
