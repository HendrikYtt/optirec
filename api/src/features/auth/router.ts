import PromiseRouter from 'express-promise-router';
import { AuthError } from '../../constants/errors';
import { protect } from '../../lib/auth';
import { UnauthorizedError } from '../../lib/errors';
import { createAccessToken } from '../../lib/jwt';
import { validateBody } from '../../lib/validator';
import {
    AccountResponseSchema,
    ChangePasswordRequestSchema,
    LoginRequestSchema,
    RegisterRequestSchema,
    RenewAccessResponseSchema,
} from './schema';
import {
    addSession,
    authenticateEmailAndPassword,
    changePassword,
    getAccountByIdOrThrow,
    getSessionByRefreshTokenOrThrow,
    registerWithEmailAndPassword,
} from './service';

export const authRouter = PromiseRouter();

authRouter.post<unknown, unknown, LoginRequestSchema>('/login', validateBody(LoginRequestSchema), async (req, res) => {
    const { email, password } = req.body;
    const accessToken = await authenticateEmailAndPassword(email, password);
    const session = await addSession(email);
    return res.json({ access_token: accessToken, refresh_token: session.refresh_token });
});

authRouter.post<unknown, unknown, RegisterRequestSchema>(
    '/register',
    validateBody(RegisterRequestSchema),
    async (req, res) => {
        const { email, password } = req.body;
        const accessToken = await registerWithEmailAndPassword(email, password);
        const session = await addSession(email);
        return res.json({ access_token: accessToken, refresh_token: session.refresh_token });
    },
);

authRouter.get<unknown, AccountResponseSchema>('/me', protect(), async (req, res) => {
    const user = await getAccountByIdOrThrow(req.account.sub);
    return res.json({ email: user.email });
});

authRouter.post<unknown, RenewAccessResponseSchema>('/renew-access', async (req, res) => {
    const { refresh_token: refreshToken } = req.body;
    const session = await getSessionByRefreshTokenOrThrow(refreshToken);
    const accessToken = createAccessToken(session.account_id);
    return res.json({ access_token: accessToken });
});

authRouter.put<unknown, unknown, ChangePasswordRequestSchema>(
    '/change-password',
    protect(),
    validateBody(ChangePasswordRequestSchema),
    async (req, res) => {
        const { old_password: oldPassword, new_password: newPassword } = req.body;
        if (oldPassword === newPassword) {
            throw new UnauthorizedError(AuthError.PasswordsMustBeDifferent);
        }
        const account = await getAccountByIdOrThrow(req.account.sub);
        await changePassword(oldPassword, newPassword, account);
        return res.json({ status: 'ok' });
    },
);
