import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FC, useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';

type DeletePropertyButtonProps = { callback: () => Promise<void> };

export const DeletePropertyButton: FC<DeletePropertyButtonProps> = ({ callback }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <IconButton edge="end" onClick={() => setIsOpen(true)}>
                <Delete />
            </IconButton>

            <ConfirmationDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Do you really want to delete this property?"
                description="When deleting a property, its data in all existing items are lost forever. This action cannot be reverted."
                ActionButtonProps={{
                    startIcon: <Delete />,
                    children: 'Delete Property',
                }}
                onConfirm={async () => {
                    await callback();
                    setIsOpen(false);
                }}
            />
        </>
    );
};
