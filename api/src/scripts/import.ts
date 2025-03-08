import { createReadStream } from 'fs';
import { Transform } from 'stream';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { from } from 'pg-copy-streams';
import { knex } from '../connections/knex';
import { findApplicationInteractionProperties } from '../features/applications/interactions/database';
import { findApplicationItemProperties } from '../features/applications/items/database';
import { Property } from '../features/applications/properties/model';
import { findApplicationUserProperties } from '../features/applications/users/database';
import { validateAttributes } from '../features/integrations/service';

const importData = async (table: string, findApplicationTableProperties: (appId: number) => Promise<Property[]>) => {
    const applicationId = 1;
    const properties = await findApplicationTableProperties(applicationId);

    const validate = new Transform({
        objectMode: true,
        transform: (chunk, encoding, callback) => {
            chunk.attributes = JSON.parse(chunk.attributes);
            delete chunk.expires_at;
            try {
                validateAttributes(chunk.attributes, properties);
                callback(null, chunk);
            } catch (error) {
                callback(error as Error);
            }
        },
    });

    await knex.raw(`drop table if exists apps_${applicationId}._tmp_${table}`);
    await knex.raw(
        `create table apps_${applicationId}._tmp_${table} as (Select * from apps_${applicationId}.${table} limit 1) with no data`,
    );

    const connection = await knex.client.acquireConnection();

    const query = `COPY apps_${applicationId}._tmp_${table} FROM STDIN WITH CSV HEADER`;
    const copy = connection.query(from(query));

    await new Promise<void>((resolve, reject) => {
        createReadStream(`${__dirname}/../../../docs/coolbet/data/prod-2023-03-14/${table}.csv`)
            .pipe(parse({ delimiter: ',', columns: true, trim: true }))
            .pipe(validate)
            .pipe(stringify({ delimiter: ',' }))
            .pipe(copy)
            .on('error', reject)
            .on('finish', resolve);
    });

    await knex.raw(
        `insert into apps_${applicationId}.${table} select * from apps_${applicationId}._tmp_${table} on conflict(id) do update set attributes = EXCLUDED.attributes`,
    );
    await knex.raw(`drop table apps_${applicationId}._tmp_${table}`);

    await knex.client.releaseConnection(connection);
};

(async () => {
    await importData('users', findApplicationUserProperties);
    await importData('items', findApplicationItemProperties);
    await importData('interactions', findApplicationInteractionProperties);

    await knex.destroy();
})();
