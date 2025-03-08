import { Settings } from '@mui/icons-material';
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { CreatePropertySchema, Property } from '../schemas/application';
import { CreatePropertyButton } from './CreatePropertyButton';
import { DeletePropertyButton } from './DeletePropertyButton';

type ManagePropertiesButtonProps = {
    title: string;
    properties: Property[];
    onCreate: (property: CreatePropertySchema) => Promise<unknown>;
    onDelete: (id: number) => Promise<void>;
};

export const ManagePropertiesButton: FC<ManagePropertiesButtonProps> = ({ title, properties, onCreate, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteProperty = async (id: number) => {
        await onDelete(id);
        setIsOpen(false);
    };

    return (
        <>
            <Button startIcon={<Settings />} color="inherit" onClick={() => setIsOpen(true)}>
                Manage properties
            </Button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <List>
                        {properties.map(({ id, name, type }) => (
                            <ListItem>
                                <Stack
                                    sx={{ width: '100%' }}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Stack direction="row" alignItems="center" columnGap={1}>
                                        <Typography>{name}</Typography>
                                        <Chip label={type} size="small" />
                                    </Stack>
                                    <DeletePropertyButton callback={() => handleDeleteProperty(id)} />
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <CreatePropertyButton callback={onCreate} />
                </DialogActions>
            </Dialog>
        </>
    );
};
