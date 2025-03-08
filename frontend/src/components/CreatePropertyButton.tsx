import { Add, Check } from '@mui/icons-material';
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, InputLabel, Stack, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { CreatePropertySchema, PropertyType } from '../schemas/application';

type CreatePropertyButtonProps = {
    callback: (property: CreatePropertySchema) => Promise<unknown>;
};

export const CreatePropertyButton: FC<CreatePropertyButtonProps> = ({ callback }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<PropertyType>();

    const handleCreate = async () => {
        if (!type) {
            return;
        }
        setIsLoading(true);
        try {
            await callback({ name, type });
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button startIcon={<Add />} variant="contained" onClick={() => setIsOpen(true)}>
                Create Property
            </Button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>New Property</DialogTitle>
                <DialogContent>
                    <Stack rowGap={1} minWidth={400}>
                        <InputLabel>Name</InputLabel>
                        <TextField value={name} onChange={(e) => setName(e.target.value)} />

                        <InputLabel>Data type</InputLabel>
                        <ButtonGroup>
                            {Object.values(PropertyType).map((name) => (
                                <Button
                                    key={name}
                                    variant={type === name ? 'contained' : 'outlined'}
                                    onClick={() => setType(name)}
                                >
                                    {name}
                                </Button>
                            ))}
                        </ButtonGroup>

                        <Button
                            startIcon={<Check />}
                            variant="contained"
                            color="success"
                            disabled={!name || !type || isLoading}
                            onClick={handleCreate}
                        >
                            Create Property
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};
