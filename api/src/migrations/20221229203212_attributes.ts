import { Knex } from 'knex';

export const up = async (knex: Knex) => {
    const schemas = await listSchemaInfo(knex);

    for (const { schemaname, has_attributes } of schemas) {
        await knex.schema.withSchema(schemaname).alterTable('items', (t) => {
            t.dropColumn('keywords');
            if (!has_attributes) {
                t.jsonb('attributes').defaultTo('{}').notNullable();
            }
        });
    }
};

export const down = async (knex: Knex) => {
    const schemas = await listSchemaInfo(knex);

    for (const { schemaname } of schemas) {
        await knex.schema.withSchema(schemaname).alterTable('items', (t) => {
            t.specificType('keywords', 'text[]');
            t.dropColumn('attributes');
        });
    }
};

const listSchemaInfo = async (knex: Knex) => {
    const query = `
        SELECT t.schemaname, 'attributes' = any(array_agg(a.attname)) AS has_attributes
        FROM pg_stat_user_tables AS t
        LEFT JOIN pg_attribute AS a ON a.attrelid = t.relid
        WHERE t.schemaname LIKE 'apps_%'
        GROUP BY t.schemaname;
    `;
    const { rows } = await knex.raw(query);
    return rows as { schemaname: string; has_attributes: boolean }[];
};
