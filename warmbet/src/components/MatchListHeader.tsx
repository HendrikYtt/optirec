import { SvgIconComponent } from '@mui/icons-material';
import { Divider, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { FC, ReactNode } from 'react';
import { UiSurface } from './ui/Surface';

export type MatchListHeaderProps = {
    title: ReactNode;
    description: ReactNode;
    Icon: SvgIconComponent;
};

const Glare = styled('div')({
    width: '60%',
    height: '100%',
    transform: 'skew(-45deg)',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    bottom: 0,
    left: '-10%',
});

export const MatchListHeader: FC<MatchListHeaderProps> = ({ title, description, Icon }) => {
    const theme = useTheme();
    return (
        <UiSurface sx={{ position: 'relative', borderColor: theme.palette.primary.main }}>
            <Glare />
            <Stack direction="row" columnGap={1} alignItems="center">
                <Icon color="primary" />
                <Divider orientation="vertical" flexItem />
                <Stack>
                    <Typography letterSpacing={1}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                </Stack>
            </Stack>
        </UiSurface>
    );
};
