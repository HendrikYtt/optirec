import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import { redis } from '../connections/redis';
import { log } from '../lib/log';

export const start = async () => {
    const subClient = redis.duplicate();
    await Promise.all([redis.connect(), subClient.connect()]);

    const io = new Server({
        cors: {
            origin: process.env.ORIGIN?.split(',') ?? '*',
            methods: ['GET', 'POST'],
        },
    });
    io.adapter(createAdapter(redis, subClient));
    io.on('connection', (socket) => {
        log.info(`User connected`);
        socket.join('apps_23');
        socket.on('disconnect', () => {
            log.info('User disconnected');
        });
    });

    const server = io.listen(3000);
    log.info('Pusher started on port 3000');

    process.once('SIGTERM', async () => {
        log.info('SIGTERM received, shutting down gracefully');
        await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
        await Promise.all([redis.disconnect(), subClient.disconnect()]);
    });
};
