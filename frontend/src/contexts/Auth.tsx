import { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { getMyProfile } from '../api/auth';
import { makeContext } from '../lib/context';
import { storage } from '../lib/storage';
import { TokenPayload } from '../models/jwt';
import { UserResponseSchema } from '../schemas/auth';

let logoutTimer: string | number | NodeJS.Timeout | undefined;

export const [AuthProvider, useAuth] = makeContext(() => {
    const [accessToken, setAccessToken] = useState<string>();
    const [refreshToken, setRefreshToken] = useState<string>();
    const [isBootstrapped, setIsBootstrapped] = useState<boolean>(false);
    const [profile, setProfile] = useState<UserResponseSchema>();
    const isLoggedIn = !!accessToken;

    useEffect(() => {
        initAuth();
        setIsBootstrapped(true);
    }, []);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const loadProfile = async () => {
            const profile = await getMyProfile();
            setProfile(profile);
        };
        loadProfile();
    }, [accessToken]);

    const authenticate = (accessToken: string) => {
        storage.set('token', accessToken);
        setAccessToken(accessToken);
        const remainingTime = calculateRemainingTime(accessToken);
        logoutTimer = setTimeout(silentLogout, remainingTime * 1000);
    };

    const initAuth = () => {
        const token = storage.get('token');
        if (!token) {
            return;
        }

        const remainingTime = calculateRemainingTime(token);
        logoutTimer = setTimeout(silentLogout, remainingTime * 1000);
        if (remainingTime <= 0) {
            storage.del('token');
            return;
        }
        setAccessToken(token);
    };

    const logout = () => {
        storage.del('token');
        removeCookie('refresh_token', { expires: 1 });
        setAccessToken(undefined);
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    const silentLogout = () => {
        storage.del('token');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    const updateRefreshToken = (refreshToken: string) => {
        setRefreshToken(refreshToken);
    };

    const user = accessToken ? (decodeToken(accessToken) as TokenPayload) : undefined;

    return {
        accessToken,
        refreshToken,
        updateRefreshToken,
        isLoggedIn,
        authenticate,
        logout,
        user,
        profile,
        setCookie,
        getCookie,
        isBootstrapped,
    };
});

const calculateRemainingTime = (token: string | undefined) => {
    if (!token) {
        return 0;
    }

    const decodedToken: TokenPayload | null = decodeToken(token);
    if (decodedToken === null) {
        return 0;
    }

    const currentTime = Math.floor(new Date().getTime() / 1000);
    return decodedToken.exp - currentTime;
};
