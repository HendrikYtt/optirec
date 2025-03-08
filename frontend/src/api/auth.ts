import { http } from '../lib/http';

type MyProfile = { email: string };

export const getMyProfile = async () => http.get<MyProfile>('/auth/me');

type AuthResponse = { access_token: string; refresh_token: string };
type RenewAccessResponse = { access_token: string };

export const login = async (email: string, password: string) =>
    http.post<AuthResponse>('/auth/login', { email, password });

export const register = async (email: string, password: string) =>
    http.post<AuthResponse>('/auth/register', { email, password });

export const renewAccessToken = async (refreshToken: string) =>
    http.post<RenewAccessResponse>('/auth/renew-access', { refresh_token: refreshToken });

export const changePassword = async (oldPassword: string, newPassword: string) =>
    http.put('/auth/change-password', { old_password: oldPassword, new_password: newPassword });
