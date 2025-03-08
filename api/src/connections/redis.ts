import { createClient } from 'redis';

const { REDIS_HOST = 'localhost' } = process.env;

export const redis = createClient({ url: `redis://${REDIS_HOST}:6379` });
