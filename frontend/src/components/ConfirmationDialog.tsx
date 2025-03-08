import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { FC } from 'react';

type ConfirmationDialogProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title: string;
    description: string;
    ActionButtonProps: ButtonProps;
    onConfirm: () => void;
};

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
    isOpen,
    setIsOpen,
    title,
    description,
    ActionButtonProps,
    onConfirm,
}) => {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={() => setIsOpen(false)}>
                    Cancel
                </Button>
                <Button variant="contained" color="error" {...ActionButtonProps} onClick={onConfirm} />
            </DialogActions>
        </Dialog>
    );
};
