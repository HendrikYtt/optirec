import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { TestData } from '../../constants/test';
import { server, testKnex } from '../../lib/test';
import { LoginRequestSchema } from '../auth/schema';
import { CreateApplicationSchema } from './schema';

const TEST_LOGIN_REQUEST: LoginRequestSchema = {
    email: TestData.TestEmail,
    password: TestData.TestPassword,
};

const TEST_APPLICATION: CreateApplicationSchema = {
    name: TestData.ApplicationName,
};

describe('/applications', () => {
    let token: string;
    beforeEach(async () => {
        const { status, body } = await server.post('/auth/register').send(TEST_LOGIN_REQUEST);
        expect(status).to.eq(200, JSON.stringify(body));
        ({ token } = body);
    });

    describe('POST /', () => {
        it('should create an application, new schema and an application key ', async () => {
            let { status, body } = await server
                .post('/applications')
                .send(TEST_APPLICATION)
                .set('Authorization', `Bearer ${token}`);
            expect(status).to.eq(200, JSON.stringify(body));
            expect(body.token).to.be.a.string;

            const application = await testKnex('applications').first();
            expect(application).to.deep.include(TEST_APPLICATION);

            const result = await testKnex.raw(
                'SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?',
                [`apps_${application?.id}`],
            );
            const rowsLength: number = result['rows'].length;
            expect(rowsLength).to.eq(1);

            ({ status, body } = await server.post('/applications/1/keys').set('Authorization', `Bearer ${token}`));
            expect(status).to.eq(200, JSON.stringify(body));
            expect(body.key).to.be.a.string;

            const applicationKey = await testKnex('application_keys').first();
            expect(applicationKey?.key).to.eq(body.key);
        });
    });
});
