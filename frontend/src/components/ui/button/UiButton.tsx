import Button, { ButtonProps } from '@mui/material/Button';
import React from 'react';

type UiButtonProps = ButtonProps & { title: string };

export const UiButton: React.FC<UiButtonProps> = ({ title, ...props }) => {
    return <Button {...props}>{title}</Button>;
};
