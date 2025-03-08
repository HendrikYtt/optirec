import MuiMarkdown from 'mui-markdown';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Breadcrumbs, Button, Grid, Link, Paper, Stack, Tab } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import prismTheme from 'prism-react-renderer/themes/dracula';
import { ApiKey } from '../components/ApiKey';
import { Chart } from '../components/ui/charts/Chart';
import { UiTitle } from '../components/ui/title/UiTitle';
import { BaseLayout } from '../layout/BaseLayout';
import { theme } from '../themes';
import { UiButton } from '../components/ui/button/UiButton';
export const Application = () => {
    const [value, setValue] = useState('1');
    const navigate = useNavigate();
    const location = useLocation();

    const { id, name } = location.state;

    const userMetaDataApi = `
    POST https://api.optirec.ml/integrations/v1/users
    {
        "id": "1"
    }
    RESPONSE
    {
        "id": "5",
        "created_at": "2023-01-08T12:54:25.753Z"
    }
    `;

    const itemMetaDataApi = `
    POST https://api.optirec.ml/integrations/v1/items
    {
        "id": "1",
        "title": "The best movie in the world",
        "attributes": {"key": "comedy, drama"}
    }
    RESPONSE
    {
        "id": "1",
        "title": "The best movie in the world",
        "attributes": {
            "key": "comedy, drama"
        },
        "created_at": "2023-01-08T12:58:15.357Z"
    }
    `;
    const userItemRelationApi = `
    POST https://api.optirec.ml/integrations/v1/interactions
    {
        "id": "1",
        "userId": "1",
        "itemId": "1",
        "rating": 5
    }
    RESPONSE
    {
        "id": "1",
        "user_id": "1",
        "item_id": "1",
        "rating": "5.0",
        "created_at": "2023-01-08T12:59:56.580Z"
    }
    `;
    const getSimilarItemsRecommendationApi = `
    GET https://api.optirec.ml/integrations/v1/recommendations/als/items/1/items
    RESPONSE
    [
        {
            "id": 356,
            "score": 0.42941897808947066
        },
        {
            "id": 150,
            "score": 0.4787096505275777
        },
        {
            "id": 480,
            "score": 0.5254630875482593
        },
        ...
    ]
    `;
    const getItemRecommendationsForUser = `
    GET https://api.optirec.ml/integrations/v1/recommendations/als/users/1/items
    RESPONSE
    [
        {
            "id": 1196,
            "score": 1.0309381223771932
        },
        {
            "id": 1210,
            "score": 1.0084106406040005
        },
        {
            "id": 260,
            "score": 1.0073396136181971
        },
        ...
    ]
    `;
    const getItemRecommendationsByPopularity = `
    GET https://api.optirec.ml/schemas/schema/models/popularity/items
    RESPONSE
    [
        {
            "id": 356,
            "score": 329
        },
        {
            "id": 318,
            "score": 317
        },
        {
            "id": 296,
            "score": 307
        },
        ...
    ]
    `;
    const getItemRecommendationsByRating = `
    GET https://api.optirec.ml/schemas/schema/models/rating/items
    RESPONSE
    [
        {
            "id": 318,
            "score": 1404.0
        },
        {
            "id": 356,
            "score": 1370.0
        },
        {
            "id": 296,
            "score": 1288.5
        },
        ...
    ]
    `;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <BaseLayout>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link underline="hover" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </Link>
                <Typography>{name}</Typography>
            </Breadcrumbs>
            <UiTitle>Metrics</UiTitle>
            <Typography>Monitor your applications and get insights</Typography>
            <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" color={theme.palette.text.secondary} my={2}>
                        Frequency
                    </Typography>
                    <Chart
                        colors={[theme.palette.primary.dark]}
                        footerText="Recommendations served per second"
                        graphType="bar"
                        showLabels={false}
                        seriesData={[
                            {
                                name: 'Recommendations served',
                                data: {
                                    monthly: [60, 110, 35, 33, 35, 60, 36, 150, 66, 30, 25, 53, 36],
                                    weekly: [110, 32, 45, 32, 34, 52, 41],
                                },
                            },
                        ]}
                    ></Chart>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h5" color={theme.palette.text.secondary} my={2}>
                        Interactions
                    </Typography>
                    <Chart
                        colors={[theme.palette.primary.dark]}
                        footerText="Number of interactions"
                        graphType="bar"
                        showLabels={false}
                        seriesData={[
                            {
                                name: 'Interactions',
                                data: {
                                    monthly: [11000, 6000, 15000, 3500, 6000, 3600, 2600, 4500, 6500, 5200, 5300, 4100],
                                    weekly: [110, 320, 450, 320, 340, 520, 410],
                                },
                            },
                        ]}
                    ></Chart>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" color={theme.palette.text.secondary} my={2}>
                        Hit rate
                    </Typography>
                    <Chart
                        colors={[theme.palette.primary.dark]}
                        footerText="Correct recommendations served (%)"
                        graphType="line"
                        showLabels={true}
                        seriesData={[
                            {
                                name: 'Hit rate',
                                data: {
                                    monthly: [81, 85, 90, 92, 87, 85, 91, 92, 94, 86, 88, 85],
                                    weekly: [80, 85, 89, 82, 88, 95, 83],
                                },
                            },
                        ]}
                    ></Chart>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" color={theme.palette.text.secondary} my={2}>
                        Performance
                    </Typography>
                    <Chart
                        colors={[theme.palette.primary.dark, theme.palette.secondary.dark]}
                        footerText="Train and recommend durations (sec)"
                        graphType="area"
                        showLabels={false}
                        seriesData={[
                            {
                                name: 'Train duration',
                                data: {
                                    monthly: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35],
                                    weekly: [31, 40, 28, 51, 42, 109, 100],
                                },
                            },
                            {
                                name: 'Recommend duration',
                                data: {
                                    monthly: [11, 6, 15, 3, 6, 3, 2, 4, 6, 5, 5, 4],
                                    weekly: [1, 3, 4, 3, 3, 5, 4],
                                },
                            },
                        ]}
                    ></Chart>
                </Grid>
            </Grid>
            <Stack my={4} alignItems="center">
                <UiButton
                    variant="contained"
                    color="primary"
                    title="Update your pricing plan"
                    sx={{ fontWeight: 'bold' }}
                    onClick={() => {
                        navigate('/');
                        window.scrollTo(0, document.body.scrollHeight);
                        window.scrollBy(0, -1400);
                    }}
                    size="large"
                />
            </Stack>
            <ApiKey key={id} id={id.toString()}></ApiKey>

            <Box mt={4}>
                <UiTitle>Catalog</UiTitle>
                <Typography my={1}>Manage properties of the data you send to OptiRec</Typography>
            </Box>

            <Stack direction="row" justifyContent="space-evenly">
                <Button variant="contained" onClick={() => navigate(`/databases/${id}/users`)}>
                    View users
                </Button>
                <Button variant="contained" onClick={() => navigate(`/databases/${id}/items`)}>
                    View items
                </Button>
                <Button variant="contained" onClick={() => navigate(`/databases/${id}/interactions`)}>
                    View interactions
                </Button>
            </Stack>

            <Box mt={4}>
                <UiTitle>Integration Guide</UiTitle>
                <Typography my={1}>Follow the steps below for seamless integration with OptiRec</Typography>
            </Box>

            <Grid container item columnGap={1} alignItems="start" rowGap={1} direction="column">
                <TabContext value={value}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TabList
                            onChange={handleChange}
                            textColor="primary"
                            indicatorColor="primary"
                            scrollButtons="auto"
                        >
                            <Tab label="REST API" value="1" />
                        </TabList>
                        <TabPanel value="1">
                            <MuiMarkdown
                                codeBlockTheme={prismTheme}
                                inlineCodeBgColor="#ffffff00"
                                inlineCodeColor="#7ee629"
                            >
                                {
                                    '>  <div> 1. The first step is to generate the API key above using <b>`ADD` button. \n For example: `d3704574-18f8-432f-adbf-ad14c324332c` \n 3. Now, whenever creating a new query, add `X-token` header into your query and set the value to the copied UUID value. \n 4.  Now on to the integration 😄 \n </div>'
                                }
                            </MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {' <p> - ** Step 1 - Store data **</p><p>  - 1.1 Store user metadata</p>'}
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{userMetaDataApi}</MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {'<p> - 1.2 Store item metadata</p>'}
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{itemMetaDataApi}</MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {'<p> - 1.3 Store user-item interaction (must have inserted item and user before)</p>'}
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{userItemRelationApi}</MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {
                                    ' <p> - ** Step 2 - Recommendations **</p><p> - 2.1 Get recommendations for similar items</p>'
                                }
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{getSimilarItemsRecommendationApi}</MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {'<p> - 2.2 Get recommended items for a user</p>'}
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{getItemRecommendationsForUser}</MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {'<p> - 2.3 Get recommended items by popularity</p>'}
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{getItemRecommendationsByPopularity}</MuiMarkdown>
                            <MuiMarkdown inlineCodeColor="dodgerblue">
                                {'<p> - 2.4 Get recommended items by users ratings</p>'}
                            </MuiMarkdown>
                            <MuiMarkdown codeBlockTheme={prismTheme}>{getItemRecommendationsByRating}</MuiMarkdown>
                        </TabPanel>
                    </Paper>
                </TabContext>
            </Grid>
        </BaseLayout>
    );
};
