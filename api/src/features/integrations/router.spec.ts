import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { TestData } from '../../constants/test';
import { intergrationsServer, server, testKnex } from '../../lib/test';
import { CreateApplicationSchema } from '../applications/schema';
import { LoginRequestSchema } from '../auth/schema';
import { InteractionRequestSchema } from './interactions/schema';
import { ItemRequestSchema } from './items/schema';
import { UserRequestSchema } from './users/schema';

const TEST_LOGIN_REQUEST: LoginRequestSchema = {
    email: TestData.TestEmail,
    password: TestData.TestPassword,
};

const TEST_APPLICATION: CreateApplicationSchema = {
    name: TestData.ApplicationName,
};

const TEST_USER: UserRequestSchema = {
    id: '1',
    attributes: {
        key: 'value',
    },
};

const TEST_ITEM: ItemRequestSchema = {
    id: '1',
    attributes: {
        key: 'value',
    },
};

const TEST_INTERACTION: InteractionRequestSchema = {
    id: '1',
    user_id: '1',
    item_id: '1',
    rating: 5.6,
    attributes: {},
};

describe('Integrations', () => {
    let key: string;

    beforeEach(async () => {
        let { status, body } = await server.post('/auth/register').send(TEST_LOGIN_REQUEST);
        expect(status).to.eq(200, JSON.stringify(body));
        const { token } = body;
        ({ status, body } = await server
            .post('/applications')
            .send(TEST_APPLICATION)
            .set('Authorization', `Bearer ${token}`));
        expect(status).to.eq(200, JSON.stringify(body));

        ({ status, body } = await server.post('/applications/1/keys').set('Authorization', `Bearer ${token}`));
        expect(status).to.eq(200, JSON.stringify(body));
        expect(body.key).to.be.a.string;
        key = body.key;
    });

    afterEach(async () => {
        await testKnex('application_keys').del();
        await testKnex('applications').del();
        await testKnex.raw('DROP SCHEMA IF EXISTS apps_1 CASCADE');
    });

    describe('POST /users', () => {
        it('should add user', async () => {
            const { status, body } = await intergrationsServer.post('/users').send(TEST_USER).set('X-token', key);
            expect(status).to.eq(200, JSON.stringify(body));
            const user = await testKnex('apps_1.users').first();
            expect(user.id).to.eq(TEST_USER.id);
        });
    });

    describe('POST /items', () => {
        it('should add item', async () => {
            const { status, body } = await intergrationsServer.post('/items').send(TEST_ITEM).set('X-token', key);
            expect(status).to.eq(200, JSON.stringify(body));
            const item = await testKnex('apps_1.items').first();
            expect(item).to.deep.include({ id: TEST_ITEM.id });
        });
    });

    describe('POST /interactions', () => {
        it('should add interaction', async () => {
            let { status, body } = await intergrationsServer.post('/users').send(TEST_USER).set('X-token', key);
            expect(status).to.eq(200, JSON.stringify(body));
            ({ status, body } = await intergrationsServer.post('/items').send(TEST_ITEM).set('X-token', key));
            expect(status).to.eq(200, JSON.stringify(body));
            ({ status, body } = await intergrationsServer
                .post('/interactions')
                .send(TEST_INTERACTION)
                .set('X-token', key));
            expect(status).to.eq(200, JSON.stringify(body));
            const interaction = await testKnex('apps_1.interactions').first();
            expect(interaction).to.deep.include({
                user_id: TEST_INTERACTION.user_id,
                item_id: TEST_INTERACTION.item_id,
                rating: String(TEST_INTERACTION.rating),
            });
        });
    });
});
