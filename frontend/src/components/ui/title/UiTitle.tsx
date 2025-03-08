import { Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type UiTitleProps = {
    children: ReactNode;
};

export const UiTitle: FC<UiTitleProps> = ({ children }) => {
    return (
        <Typography variant="h3" fontSize={24}>
            {children}
        </Typography>
    );
};
