import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { map } from 'bluebird';
import { parse } from 'csv-parse/sync';
import { Knex } from 'knex';
import { chunk } from 'lodash';
import { v4 } from 'uuid';

const schema = 'apps_13';

export const seed = async (knex: Knex) => {
    await knex.raw(`TRUNCATE ${schema}.interactions`);
    await knex.raw(`TRUNCATE ${schema}.items CASCADE`);
    await knex.raw(`TRUNCATE ${schema}.users CASCADE`);

    const itemsPath = resolve(__dirname, 'data', 'movies.csv');
    const itemsBuffer = readFileSync(itemsPath);
    const items = (parse(itemsBuffer, { columns: true }) as { movieId: string; title: string; genres: string }[]).map(
        ({ movieId, title, genres }) => ({
            id: movieId,
            title,
            attributes: {
                genres,
            },
        }),
    );

    console.log(`Inserting ${items.length} items`);
    await map(chunk(items, 10_000), async (batch) => await knex('items').withSchema(schema).insert(batch), {
        concurrency: 1,
    });

    const ratingsPath = resolve(__dirname, 'data', 'ratings');

    const files = readdirSync(ratingsPath);
    for (const file of files) {
        const buffer = readFileSync(resolve(ratingsPath, file));
        const ratings = (
            parse(buffer, { columns: true }) as {
                userId: string;
                movieId: string;
                rating: string;
                timestamp: string;
            }[]
        ).map(({ userId, movieId, rating, timestamp }) => ({
            id: v4(),
            user_id: userId,
            item_id: movieId,
            rating,
            created_at: new Date(parseInt(timestamp, 10) * 1000),
        }));

        const users = [...new Set(ratings.map((x) => ({ id: x.user_id })))];
        console.log(`Inserting ${users.length} users`);
        await map(
            chunk(users, 10_000),
            async (batch) => await knex('users').withSchema(schema).insert(batch).onConflict('id').ignore(),
            { concurrency: 1 },
        );

        const items = [...new Set(ratings.map((x) => ({ id: x.item_id })))];
        console.log(`Inserting ${items.length} items`);
        await map(
            chunk(items, 10_000),
            async (batch) => await knex('items').withSchema(schema).insert(batch).onConflict('id').ignore(),
            { concurrency: 1 },
        );

        console.log(`Inserting ${ratings.length} interactions`);
        await map(
            chunk(ratings, 10_000),
            async (batch) => await knex.withSchema(schema).insert(batch).into('interactions'),
            { concurrency: 1 },
        );
    }
};
