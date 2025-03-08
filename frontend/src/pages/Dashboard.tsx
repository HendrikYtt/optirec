import { Alert, Card, CardActionArea, CardContent, Divider, Grid, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddApplication } from '../components/AddApplication';
import { UiTitle } from '../components/ui/title/UiTitle';
import { useApplication } from '../contexts/Application';
import { BaseLayout } from '../layout/BaseLayout';
import { useGetNewAccessToken } from '../lib/token';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { apps } = useApplication();
    const [successMessage, setSuccessMessage] = useState('');
    const { getNewAccessToken } = useGetNewAccessToken();

    const successMessageHandler = () => {
        setSuccessMessage('Application added successfully');
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const navigateToApplication = async (applicationId: string, applicationName: string) => {
        const token = await getNewAccessToken();
        if (!token) {
            navigate('/expired');
            return;
        }
        navigate(`/dashboard/applications/${applicationId}`, { state: { id: applicationId, name: applicationName } });
    };

    const daysSince = (zuluDateString: string) => {
        const date = new Date(Date.parse(zuluDateString));
        const now = new Date();
        const differenceInDays = (now.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
        return Math.floor(differenceInDays);
    };

    const toLocaleString = (zuluDateString: string) => {
        const date = new Date(Date.parse(zuluDateString));
        const time = date.toLocaleTimeString();
        const day = date.toLocaleDateString();
        return day + ' ' + time;
    };

    const constructCreatedAt = (zuluDateString: string) => {
        const days = daysSince(zuluDateString);
        if (days === 0) {
            const date = new Date(Date.parse(zuluDateString));
            if (date.getDay() === new Date().getDay()) {
                return 'today';
            }
            return 'yesterday';
        } else if (days === 1) {
            return '1 day ago';
        } else {
            return `${days} days ago`;
        }
    };

    const mockColor = (index: number, divider: number) => {
        return index % divider === 0 ? '#7CFC00' : '#FF0000';
    };

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min - 1)) + min;
    };

    return (
        <>
            <BaseLayout>
                <Grid container item rowGap={3} columnSpacing={3} mt={4}>
                    <Grid item xs={12}>
                        <UiTitle>Applications</UiTitle>
                    </Grid>
                    <Grid item xs={12} my={-2}>
                        <Typography color="text.secondary" textTransform="none">
                            Add applications to integrate to our platform
                        </Typography>
                    </Grid>
                    <AddApplication onSuccessMessage={successMessageHandler}></AddApplication>
                    {apps?.map((app, index) => (
                        <Grid item xs={12} sm={6} md={4} key={app.id}>
                            <Card>
                                <CardActionArea
                                    onClick={() => {
                                        navigateToApplication(app.id.toString(), app.name);
                                    }}
                                    sx={{
                                        minHeight: '175px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                    }}
                                >
                                    <Tooltip title={toLocaleString(app.created_at)}>
                                        <CardContent>
                                            <Typography variant="h5" textTransform="none">
                                                {app.name}
                                            </Typography>

                                            <Grid container direction="row" alignItems="center">
                                                <Grid item>
                                                    <Typography color="text.secondary" textTransform="none">
                                                        Hit rate: {randomNumber(80, 96)}%
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography color={mockColor(index, 2)} textTransform="none" ml={1}>
                                                        ({index % 2 === 0 ? '+' : '-'}
                                                        {randomNumber(2, 7)}%)
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container direction="row" alignItems="center">
                                                <Grid item>
                                                    <Typography color="text.secondary" textTransform="none">
                                                        Interactions: {randomNumber(800, 1600)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography color={mockColor(index, 3)} textTransform="none" ml={1}>
                                                        ({index % 3 === 0 ? '+' : '-'}
                                                        {randomNumber(80, 300)})
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Typography color="text.secondary" textTransform="none" pt={4}>
                                                Created {constructCreatedAt(app.created_at)}
                                            </Typography>
                                        </CardContent>
                                    </Tooltip>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item xs={12} mt={4}>
                        <Divider />
                    </Grid>
                </Grid>
                {successMessage.length > 0 && (
                    <Alert elevation={1} variant="filled" severity="success">
                        {successMessage}
                    </Alert>
                )}
            </BaseLayout>
        </>
    );
};
