import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { theme } from '../../../themes';

type UiBoxProps = {
    children: ReactNode;
};

export const UiBox: FC<UiBoxProps> = ({ children }) => {
    return (
        <Box
            py={1}
            px={2}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: `${theme.shape.borderRadius}px`,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
        >
            {children}
        </Box>
    );
};
