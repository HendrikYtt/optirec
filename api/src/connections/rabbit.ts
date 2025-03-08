import { e, haredo } from 'haredo';

const { RABBITMQ_HOST = 'localhost', RABBITMQ_USER = 'admin', RABBITMQ_PASS = 'admin' } = process.env;

export const rabbit = haredo({
    connection: {
        hostname: RABBITMQ_HOST,
        username: RABBITMQ_USER,
        password: RABBITMQ_PASS,
    },
});

export const apiExchange = e('api', 'topic').durable();

export const publish = <T>(routingKey: string, message: T) =>
    rabbit.exchange(apiExchange).skipSetup().confirm().publish(message, routingKey);
