import Knex from 'knex';
import { Client } from 'pg';
import { Application, ApplicationKey } from '../features/applications/model';
import { Property } from '../features/applications/properties/model';
import { Account, AccountLoginHistory, Session } from '../features/auth/model';
import { Interaction } from '../features/integrations/interactions/model';
import { Item } from '../features/integrations/items/model';
import { User } from '../features/integrations/users/model';
import { StripeCheckoutSession, StripeCustomer } from '../features/stripe/model';

const {
    DB_HOST = 'localhost',
    DB_PORT = 5432,
    DB_USER = 'postgres',
    DB_PASSWORD = 'postgres',
    DB_DATABASE = 'nrocinu',
} = process.env;

export const knexConfig = {
    client: 'pg',
    connection: {
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    },
    migrations: {
        directory: `${__dirname}/../migrations`,
    },
    seeds: {
        directory: `${__dirname}/../seeds`,
    },
    asyncStackTraces: true,
};

export const knex = Knex(knexConfig);

export const migrate = async () => {
    const client = new Client({ ...knexConfig.connection, database: 'postgres' });
    await client.connect();
    try {
        await client.query(`CREATE DATABASE ${knexConfig.connection.database}`);
    } catch (err) {
        if ((err as { code: string }).code !== '42P04') {
            throw err;
        }
    }
    await client.end();

    await knex.migrate.latest();
};

declare module 'knex/types/tables' {
    interface Tables {
        accounts: Account;
        accounts_login_history: AccountLoginHistory;
        applications: Application;
        application_keys: ApplicationKey;
        users: User;
        items: Item;
        interactions: Interaction;
        item_properties: Property;
        user_properties: Property;
        interaction_properties: Property;
        sessions: Session;
        stripe_checkout_sessions: StripeCheckoutSession;
        stripe_customers: StripeCustomer;
    }
}
