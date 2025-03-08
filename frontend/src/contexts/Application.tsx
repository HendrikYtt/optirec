import { useEffect, useState } from 'react';
import { makeContext } from '../lib/context';
import { getApplications } from '../api/application';
import { ApplicationResponseSchema } from '../schemas/application';
import { useAuth } from './Auth';

export const [ApplicationProvider, useApplication] = makeContext(() => {
    const { isLoggedIn } = useAuth();
    const [apps, setApps] = useState<ApplicationResponseSchema[]>();

    const loadApplications = async () => {
        const applications = await getApplications();
        setApps(applications);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        try {
            loadApplications();
        } catch (error) {
            console.error(error);
        }
    }, [isLoggedIn]);

    return {
        apps,
        loadApplications,
    };
});
