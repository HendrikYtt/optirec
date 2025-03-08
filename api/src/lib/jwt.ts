import { sign, verify } from 'jsonwebtoken';

const {
    // openssl rand -base64 60
    REFRESH_TOKEN_DURATION_HOURS = '24',
    JWT_SECRET = 'zgKYsS4gbI5ctHntvFjOamRKc7OZXwyo9Bg5X8br1o/igPPUR1l/O91e5GSmGTZNtY0zyOPQuR+u7MU/',
    JWT_AUDIENCE = 'api',
    JWT_ISSUER = 'api',
} = process.env;

export type TokenPayload = { sub: number };

export const createAccessToken = (sub: number) => {
    return sign({ sub }, JWT_SECRET, { audience: JWT_AUDIENCE, issuer: JWT_ISSUER, expiresIn: '15m' });
};

export const createRefreshToken = (sub: number) => {
    const expiresIn = parseInt(REFRESH_TOKEN_DURATION_HOURS) * 60 * 60 * 1000;
    const refreshToken = sign({ sub }, JWT_SECRET, {
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
        expiresIn: expiresIn,
    });
    return { refreshToken, expiresAt: new Date(Date.now() + expiresIn) };
};

export const verifyToken = (token: string) => {
    return verify(token, JWT_SECRET, { audience: JWT_AUDIENCE, issuer: JWT_ISSUER }) as unknown as TokenPayload;
};
