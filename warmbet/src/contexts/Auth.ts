import { useState } from 'react';
import { makeContext } from '../lib/context';
import { sendUser } from '../services/optirec';

export const [AuthProvider, useAuth] = makeContext(() => {
    const [userId, setUserId] = useState<string | undefined>(localStorage.getItem('userId') ?? undefined);

    const login = async (userId: string) => {
        await sendUser({ id: userId, attributes: { country: 'EE' } });
        setUserId(userId);
        localStorage.setItem('userId', userId);
    };

    const logout = () => {
        setUserId(undefined);
        localStorage.removeItem('userId');
    };

    return { userId, login, logout };
});
