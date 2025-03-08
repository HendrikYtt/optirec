import { Icon } from '@icon-park/react/lib/runtime';
import { Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';

type Props = {
    Icon: Icon;
    title?: string;
    children: ReactNode;
};

export const Feature = ({ Icon, title, children }: Props) => {
    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            textAlign={{ xs: 'center', md: 'left' }}
            alignItems="center"
            spacing={2}
            padding={2}
        >
            <Box>
                <Icon size={36} />
            </Box>
            <Divider orientation="vertical" flexItem />
            <Stack>
                {title && (
                    <Typography fontSize={16} fontWeight="bold">
                        {title}
                    </Typography>
                )}

                <Typography fontSize={16} color="text.secondary">
                    {children}
                </Typography>
            </Stack>
        </Stack>
    );
};
