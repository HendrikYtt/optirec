import { Check, Close } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { theme } from '../themes';

type PricingCardProps = {
    title: string;
    pros: string[];
    cons?: string[];
    price: string;
    ctaVariant?: 'contained' | 'outlined';
    ctaTitle?: string;
    onCtaClick?: () => void;
};

export const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    pros,
    cons = [],
    ctaVariant = 'contained',
    ctaTitle = 'Get Started',
    onCtaClick,
}) => {
    return (
        <Box width="100%" maxWidth="350px">
            <Card>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography textTransform="uppercase" fontWeight="bold" color={theme.palette.text.secondary}>
                            {title}
                        </Typography>
                        <Typography gutterBottom fontSize="1.6rem" color={theme.palette.primary.dark}>
                            {price}
                        </Typography>
                    </Box>
                    <Divider />
                    {pros.map((item, index) => (
                        <Grid wrap="nowrap" container alignItems="center" textAlign="left" columnGap={1} key={index}>
                            <Grid item my={1}>
                                <Check sx={{ fill: 'green' }} />
                            </Grid>
                            <Grid item>
                                <Typography color="text.secondary" dangerouslySetInnerHTML={{ __html: item }} />
                            </Grid>
                        </Grid>
                    ))}
                    {cons.map((item, index) => (
                        <Grid container alignItems={'center'} columnGap={1} key={index}>
                            <Grid item my={1}>
                                <Close sx={{ fill: 'red' }} />
                            </Grid>
                            <Grid item>
                                <Typography color="text.secondary" dangerouslySetInnerHTML={{ __html: item }} />
                            </Grid>
                        </Grid>
                    ))}
                    <Divider />
                </CardContent>
                <CardActions>
                    <Button
                        disableElevation
                        variant={ctaVariant}
                        sx={{
                            margin: 'auto',
                            marginBottom: '1rem',
                            width: '90%',
                            fontWeight: 'bold',
                        }}
                        onClick={onCtaClick}
                    >
                        {ctaTitle}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};
