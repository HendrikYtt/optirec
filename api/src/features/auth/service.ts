import { compare, hash } from 'bcrypt';
import { AuthError, SessionError } from '../../constants/errors';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../lib/errors';
import { createAccessToken, createRefreshToken } from '../../lib/jwt';
import { Account } from './model';
import {
    findAccountByEmail,
    findAccountById,
    findSessionByRefreshToken,
    insertAccount,
    insertAccountLoginHistory,
    insertSession,
    updateAccountById,
} from './repository';

export const authenticateEmailAndPassword = async (email: string, password: string) => {
    const account = await getAccountByEmail(email.toLowerCase());
    if (!account) {
        throw new UnauthorizedError(AuthError.Unauthorized);
    }
    const isPasswordValid = await compare(password, account.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError(AuthError.Unauthorized);
    }
    return authenticate(account);
};

export const registerWithEmailAndPassword = async (email: string, password: string) => {
    const user = await getAccountByEmail(email);
    if (user) {
        throw new BadRequestError(AuthError.EmailAlreadyExists);
    }

    const createdAccount = await insertAccount({
        email: email.toLowerCase(),
        password: await hash(password, 10),
    });
    return authenticate(createdAccount);
};

export const getAccountByIdOrThrow = async (id: number) => {
    const user = await findAccountById(id);
    if (!user) {
        throw new NotFoundError();
    }
    return user;
};

const getAccountByEmail = (email: string) => findAccountByEmail(email.toLowerCase());

const authenticate = async (account: Account) => {
    await insertAccountLoginHistory({ account_id: account.id });
    return createAccessToken(account.id);
};

export const getSessionByRefreshTokenOrThrow = async (token: string) => {
    const session = await findSessionByRefreshToken(token);
    if (!session) {
        throw new NotFoundError();
    }
    if (session.expires_at < new Date()) {
        throw new UnauthorizedError(SessionError.SessionExpired);
    }
    return session;
};

export const addSession = async (email: string) => {
    const account = await getAccountByEmail(email.toLowerCase());
    if (!account) {
        throw new NotFoundError();
    }
    const { refreshToken, expiresAt } = createRefreshToken(account.id);
    return await insertSession({
        account_id: account.id,
        refresh_token: refreshToken,
        expires_at: expiresAt,
    });
};

export const changePassword = async (oldPassword: string, newPassword: string, account: Account) => {
    const isPasswordValid = await compare(oldPassword, account.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError(AuthError.IncorrectOldPassword);
    }
    await updateAccountById(account.id, {
        password: await hash(newPassword, 10),
    });
};
