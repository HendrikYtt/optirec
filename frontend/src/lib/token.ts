import { useNavigate } from 'react-router-dom';
import { renewAccessToken } from '../api/auth';
import { useAuth } from '../contexts/Auth';
import { HttpError } from './http';
import { storage } from './storage';

export const useGetNewAccessToken = () => {
    const navigate = useNavigate();
    const { authenticate, logout, getCookie } = useAuth();
    const getNewAccessToken = async () => {
        const accessToken = storage.get('token');
        if (accessToken) {
            return accessToken;
        }
        const refresh_token = getCookie('refresh_token');
        if (!refresh_token) {
            logout();
            navigate('/login');
            return;
        }
        let token;
        try {
            const { access_token } = await renewAccessToken(refresh_token);
            token = access_token;
            authenticate(access_token);
        } catch (error) {
            if (error instanceof HttpError && error.body.message === 'Session expired') {
                logout();
                navigate('/expired');
                return;
            }
        }
        return token;
    };
    return { getNewAccessToken };
};
