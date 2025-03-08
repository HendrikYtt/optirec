import { knex } from '../../connections/knex';
import { ApplicationError } from '../../constants/errors';
import { cached } from '../../lib/cache';
import { BadRequestError } from '../../lib/errors';
import { Application, ApplicationKey } from './model';

export const findApplicationById = async (id: number) => {
    return knex<Application>('applications').where({ id }).first();
};

export const findApplicationsByAccountId = async (accountId: number) => {
    return knex<Application>('applications').where({ account_id: accountId });
};

export const insertApplication = async (application: Omit<Application, 'id' | 'created_at'>) => {
    const existingApplication = await findApplicationByNameAndAccountId(application.name, application.account_id);
    if (existingApplication) {
        throw new BadRequestError(ApplicationError.ApplicationAlreadyExists);
    }
    const [result] = await knex('applications').insert(application).returning('*');
    await createApplicationSchemaAndTables(result.id);
    return result;
};

export const findApplicationByNameAndAccountId = async (name: string, accountId: number) => {
    return knex('applications').where({ name, account_id: accountId }).first();
};

export const insertApplicationKey = async (
    applicationKey: Omit<ApplicationKey, 'id' | 'created_at' | 'last_used_at'>,
) => {
    const [result] = await knex('application_keys').insert(applicationKey).returning('key');
    return result;
};

export const createApplicationSchemaAndTables = async (applicationId: number) => {
    const schema = `apps_${applicationId}`;
    await knex.schema.createSchema(schema);

    await knex.schema.withSchema(schema).createTable('item_properties', (t) => {
        t.increments('id').primary();
        t.text('name').notNullable().unique();
        t.text('type').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema(schema).createTable('user_properties', (t) => {
        t.increments('id').primary();
        t.text('name').notNullable().unique();
        t.text('type').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema(schema).createTable('interaction_properties', (t) => {
        t.increments('id').primary();
        t.text('name').notNullable().unique();
        t.text('type').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema(schema).createTable('users', (t) => {
        t.text('id').primary();
        t.jsonb('attributes').notNullable().defaultTo('{}');
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema(schema).createTable('items', (t) => {
        t.text('id').primary();
        t.jsonb('attributes').notNullable().defaultTo('{}');
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema(schema).createTable('interactions', (t) => {
        t.text('id').primary();
        t.text('user_id').notNullable();
        t.text('item_id').notNullable();
        t.specificType('rating', 'numeric');
        t.jsonb('attributes').notNullable().defaultTo('{}');
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
};

export const findApplicationByApplicationKey = async (key: string) => {
    return knex('applications AS a')
        .join('application_keys AS ak', 'ak.application_id', 'a.id')
        .where('ak.key', key)
        .select<Application>('a.*')
        .first();
};

export const findApplicationByApplicationKeyCached = cached(findApplicationByApplicationKey);

export const findApplicationKeysByApplicationId = async (applicationId: number) => {
    return knex('application_keys').where({ application_id: applicationId });
};

export const deleteApplicationKeyById = async (id: number) => {
    const [apiKey] = await knex('application_keys').delete().where({ id }).returning('*');
    return apiKey;
};

export const updateApplicationKey = async (id: number, lastUsedAt: Date) => {
    const [result] = await knex('application_keys').update({ last_used_at: lastUsedAt }).where({ id }).returning('*');
    return result;
};

export const findApplicationKeyById = async (id: number) => {
    return knex('application_keys').where({ id }).first();
};
