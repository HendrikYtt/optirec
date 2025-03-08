import { expect } from 'chai';
import { TestData } from '../../constants/test';
import { server, testKnex } from '../../lib/test';
import { LoginRequestSchema } from './schema';

const TEST_LOGIN_REQUEST: LoginRequestSchema = {
    email: TestData.TestEmail,
    password: TestData.TestPassword,
};

describe('/auth', () => {
    describe('/register', () => {
        it('should register account', async () => {
            const { status, body } = await server.post('/auth/register').send(TEST_LOGIN_REQUEST);
            expect(status).to.eq(200, JSON.stringify(body));
            expect(body.token).to.be.a.string;

            const user = await testKnex('accounts').first();
            expect(user).to.deep.include({
                email: TEST_LOGIN_REQUEST.email,
            });
        });

        it('should validate email and password', async () => {
            const { status, body } = await server.post('/auth/register').send({ email: 'test', password: 'test' });
            expect(status).to.eq(400, JSON.stringify(body));

            expect(body.message).to.eq('ValidationError');
            expect(body.details[0].constraints.isEmail).to.eq('email must be an email');
            expect(body.details[1].constraints.minLength).to.eq(
                'password must be longer than or equal to 8 characters',
            );
        });
    });

    describe('/login', () => {
        it('should login with email and password', async () => {
            let { status, body } = await server.post('/auth/register').send(TEST_LOGIN_REQUEST);
            expect(status).to.eq(200, JSON.stringify(body));

            ({ status, body } = await server.post('/auth/login').send(TEST_LOGIN_REQUEST));
            expect(status).to.eq(200, JSON.stringify(body));
            expect(body.token).to.be.a.string;
        });

        it('should fail to login without an existing account', async () => {
            const { status, body } = await server.post('/auth/login').send(TEST_LOGIN_REQUEST);
            expect(status).to.eq(401, JSON.stringify(body));
            expect(body).to.deep.eq({ message: 'Invalid email or password' });
        });
    });

    describe('/me', () => {
        it('should return account data', async () => {
            let { status, body } = await server.post('/auth/register').send(TEST_LOGIN_REQUEST);
            expect(status).to.eq(200, JSON.stringify(body));

            const { token } = body;
            ({ status, body } = await server.get('/auth/me').set('Authorization', `Bearer ${token}`));
            expect(status).to.eq(200, JSON.stringify(body));
            expect(body).to.deep.eq({ email: TEST_LOGIN_REQUEST.email });
        });

        it('should fail to return user data without a valid token', async () => {
            const { status, body } = await server.get('/auth/me').set('Authorization', `Bearer invalidtoken`);
            expect(status).to.eq(401, JSON.stringify(body));
            expect(body).to.deep.eq({ message: 'jwt malformed' });
        });
    });
});
