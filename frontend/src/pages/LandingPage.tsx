import { Dollar, Football, History, HistoryQuery, Speed, TrendingUp } from '@icon-park/react';
import { ChevronRight } from '@mui/icons-material';
import { Box, Dialog, Grid, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useNavigate } from 'react-router-dom';
import { Feature } from '../components/Feature';
import { PricingCard } from '../components/PricingCard';
import { UiButton } from '../components/ui/button/UiButton';
import { UiSlider } from '../components/ui/title/slider/UiSlider';
import { theme } from '../themes';
import { ContactUs } from './ContactUs';

export const LandingPage = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [interactionsPerMonth, setInteractionsPerMonth] = useState(100000);

    const [, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize, false);
    }, [window.innerWidth]);

    return (
        <Box
            sx={{
                textAlign: 'center',
                width: '100%',
                marginTop: '50px',
            }}
        >
            <Container component="section">
                <Grid container item direction={{ xs: 'column-reverse', md: 'row' }} pt={2} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ textAlign: { md: 'end' } }}>
                        <Stack spacing={2}>
                            <Typography my={1} variant="h4" align="left" component="div">
                                {' '}
                                <Box fontWeight="bold" display="inline">
                                    AI-powered Recommender
                                </Box>
                                <Box display="inline" sx={{ opacity: 0.5 }}>
                                    {' '}
                                    as a Service{' '}
                                </Box>
                                <Box fontWeight="bold" display="inline">
                                    for iGaming Platforms
                                </Box>
                            </Typography>

                            <Typography my={1} variant="subtitle1" align="left">
                                Improve customer experience, loyalty and maximize your revenue with our AI-based
                                personalization engine, tailored by world-class data scientists.
                            </Typography>
                            <Stack
                                columnGap={2}
                                direction={{ xs: 'column-reverse', md: 'row' }}
                                justifyContent={{ xs: 'center', md: 'start' }}
                            >
                                <UiButton
                                    variant="contained"
                                    title="Get Started"
                                    sx={{ fontWeight: 'bold' }}
                                    onClick={() => navigate('/login')}
                                    size="large"
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            sx={{
                                width: '90%',
                                height: 'auto',
                            }}
                            src="assets/people.png"
                            alt="OptiRec"
                        ></Box>
                    </Grid>
                </Grid>
            </Container>

            <Grid item textAlign="center" py={2} sx={{ backgroundColor: theme.palette.background.paper }}>
                <Container component="section">
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                        Partners
                    </Typography>
                    <Stack spacing={2} mt={2}>
                        <Stack direction="row" justifyContent="center" spacing={5}>
                            <img
                                src="assets/coolbet.png"
                                height={24}
                                style={{ filter: 'grayscale(1)' }}
                                alt="coolbet image"
                            />
                            <img
                                src="assets/betvictor.svg"
                                height={24}
                                style={{ filter: 'grayscale(1)' }}
                                alt="betvictor image"
                            />
                        </Stack>
                    </Stack>
                </Container>
            </Grid>

            <Grid item textAlign="center" py={16}>
                <Container component="section">
                    <Typography variant="h4">
                        <b>Recommender Engine</b> That Drives You Forward
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" color="text.secondary">
                        Increase your customer satisfaction and spending with AI powered recommendations.
                    </Typography>
                    <Grid container justifyContent="center" my={5}>
                        <Grid item md={4}>
                            <Feature Icon={Football}>
                                <b>Optimized</b> for online sportsbook, casino and poker
                            </Feature>
                        </Grid>

                        <Grid item md={4}>
                            <Feature Icon={TrendingUp}>
                                <b>State-of-the-art</b> machine learning models
                            </Feature>
                        </Grid>
                        <Grid item md={4}>
                            <Feature Icon={Speed}>
                                <b>Response times</b> under 100 milliseconds
                            </Feature>
                        </Grid>
                    </Grid>

                    <UiButton
                        title="Try Our Interactive Demo"
                        variant="contained"
                        sx={{ fontWeight: 'bold' }}
                        endIcon={<ChevronRight />}
                        onClick={() => navigate('/playground')}
                    />
                </Container>
            </Grid>

            <Grid item textAlign="center" py={16} sx={{ backgroundColor: theme.palette.background.paper }}>
                <Container component="section">
                    <Typography variant="h4">
                        <b>Quick and Easy Integration</b> into Your Environment
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" color="text.secondary">
                        The recommendation engine is provided by RESTful API and SDKs for multiple programming
                        languages.
                    </Typography>

                    <Stack spacing={1} my={5} style={{ textAlign: 'left' }}>
                        <CodeBlock
                            text={`# Send a interaction on bet placement on match 1 by user 2 with stake 5.00

POST https://api.optirec.ml/integrations/v1/interactions
{ "itemId": 1, "userId": 2, "rating": 5.00 }`}
                            language="python"
                            showLineNumbers={true}
                            theme={dracula}
                        />
                        <CodeBlock
                            text={`# Get 10 recommended matches for user 2

GET https://api.optirec.ml/integrations/v1/recommendations/als/users/2/items`}
                            language="python"
                            showLineNumbers={true}
                            theme={dracula}
                        />
                        <CodeBlock
                            text={`[
    { "itemId": 1, "score": 0.99 },
    { "itemId": 451, "score": 0.89 },
    { "itemId": 502, "score": 0.78 },
    ...
]`}
                            language="python"
                            showLineNumbers={true}
                            theme={dracula}
                        />
                    </Stack>
                </Container>
            </Grid>

            <Grid item textAlign="center" py={16}>
                <Container component="section">
                    <Typography variant="h4">Technology</Typography>
                    <Typography gutterBottom variant="subtitle1">
                        State-of-the-art AI algorithms for personalized recommendations
                    </Typography>

                    <Grid container direction="row" alignItems="center" my={5}>
                        <Grid container item xs={12} md={6} justifyContent="center">
                            <iframe
                                src="https://enos.itcollege.ee/~jokoor/circles/animation.html"
                                scrolling="no"
                                frameBorder="0"
                                width="450"
                                height="450"
                            ></iframe>
                        </Grid>
                        <Grid
                            container
                            item
                            xs={12}
                            md={6}
                            direction="column"
                            textAlign={{ xs: 'center', md: 'start' }}
                            justifyContent="center"
                        >
                            <Grid item my={2}>
                                <Feature Icon={TrendingUp} title="Popularity-based Recommendations">
                                    Recommend matches based on the number of interacted users
                                </Feature>
                            </Grid>
                            <Grid item my={2}>
                                <Feature Icon={Dollar} title="Rating-based Recommendations">
                                    Recommend matches which have the highest turnover
                                </Feature>
                            </Grid>
                            <Grid item my={2}>
                                <Feature Icon={History} title="Collaborative Filtering">
                                    Recommend matches based on interactions history of similar users
                                </Feature>
                            </Grid>
                            <Grid item my={2}>
                                <Feature Icon={HistoryQuery} title="Content-based Filtering">
                                    Recommend matches based on their metadata
                                </Feature>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>

            <Grid container item direction="column" py={16} sx={{ backgroundColor: theme.palette.background.paper }}>
                <Container component="section">
                    <Typography variant="h4">Pricing</Typography>
                    <Typography gutterBottom variant="subtitle1" color="text.secondary">
                        Usage-Based Plans for Sites of All Sizes
                    </Typography>

                    <Box px={8} pt={8}>
                        <UiSlider
                            min={100000}
                            max={10000000}
                            step={100000}
                            marks
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => (
                                <Box>
                                    <Typography fontWeight="bold">{value.toLocaleString()}</Typography>
                                    <Typography variant="body2">interactions / month</Typography>
                                </Box>
                            )}
                            value={interactionsPerMonth}
                            onChange={(_, newValue) => setInteractionsPerMonth(newValue as number)}
                        />
                    </Box>

                    <Stack
                        spacing={5}
                        justifyContent="space-evenly"
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'center', md: 'start' }}
                    >
                        <PricingCard
                            title="Free Plan"
                            price="Free"
                            pros={[
                                'Up to <strong>10 000</strong> items',
                                'Up to <strong>10 000</strong> users',
                                'Up to <strong>100 000</strong> recommendations/mo',
                            ]}
                            cons={['Customer Support', 'Availability Guarantees']}
                            onCtaClick={() => {
                                navigate('/login');
                            }}
                        ></PricingCard>
                        <PricingCard
                            title="Professional"
                            price={`${recommendationsToPrice(interactionsPerMonth)}€ / month`}
                            pros={[
                                '<strong>10 000 - 2 000 000</strong> items',
                                '<strong>10 000 - 2 000 000</strong> users',
                                `<strong>${interactionsPerMonth.toLocaleString()}</strong> recommendations/mo`,
                                'L1 Technical Support',
                                'Advanced Integration Support',
                                '99.9% Uptime SLA',
                            ]}
                            cons={[]}
                            onCtaClick={() => {
                                navigate('/login');
                            }}
                        ></PricingCard>
                        <PricingCard
                            title="Premium"
                            price="Custom"
                            pros={[
                                '<strong>2 000 000+</strong> items',
                                '<strong>2 000 000+</strong> users',
                                `<strong>10 000 000+</strong> recommendations/mo`,
                                'Dedicated Support',
                                '99.999% Uptime SLA',
                            ]}
                            ctaTitle="Contact Us"
                            ctaVariant="outlined"
                            onCtaClick={openDialog}
                        ></PricingCard>
                    </Stack>
                    <Dialog
                        open={open}
                        onClose={() => closeDialog()}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                        maxWidth="lg"
                    >
                        <ContactUs />
                    </Dialog>
                </Container>
            </Grid>

            <Grid item textAlign="right" py={5}>
                <Container component="section">
                    <Typography variant="h4">OptiRec</Typography>
                    <a style={{ color: '#7EE629' }} href="mailto:info@optirec.ml">
                        info@optirec.ml
                    </a>
                </Container>
            </Grid>
        </Box>
    );
};

const recommendationsToPrice = (recommendations: number) => {
    return (79 + (0.2 / 1000) * recommendations).toFixed(0);
};
