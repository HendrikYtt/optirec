/* eslint-disable @typescript-eslint/no-var-requires */
import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Knex from 'knex';
import type { Knex as KnexType } from 'knex';
import { Client } from 'pg';
import { knexConfig } from '../connections/knex';
import { app } from '../services/web';
import { app as integrationsApp } from '../services/integrations';

chai.use(chaiHttp);

export const server = chai.request(app).keepOpen();
export const intergrationsServer = chai.request(integrationsApp).keepOpen();

export let testKnex: KnexType;

const client = new Client({ ...knexConfig.connection, database: 'postgres' });

before(async () => {
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${knexConfig.connection.database}_test`);
    await client.query(`CREATE DATABASE ${knexConfig.connection.database}_test`);
});

beforeEach(async () => {
    testKnex = Knex({
        ...knexConfig,
        connection: {
            ...knexConfig.connection,
            database: `${knexConfig.connection.database}_test`,
        },
    });
    await testKnex.migrate.latest();

    await require('../connections/knex').knex.destroy();
    require('../connections/knex').knex = testKnex;
});

afterEach(async () => {
    await testKnex.migrate.rollback();
    await testKnex.destroy();
});

after(async () => {
    server.close();
    intergrationsServer.close();

    await client.query(`DROP DATABASE ${knexConfig.connection.database}_test`);
    await client.end();
});
