import { AccountCircle } from '@mui/icons-material';
import {
    Autocomplete,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useAuth } from '../contexts/Auth';
import { useQuery } from '../hooks/query';
import { findUsers } from '../services/optirec';

type LoginButtonProps = {};

export const LoginButton: FC<LoginButtonProps> = () => {
    const { userId, login, logout } = useAuth();
    const [selectedUserId, setSelectedUserId] = useState<string>();
    const [isOpen, setIsOpen] = useState(false);
    const [users] = useQuery(findUsers, []);
    const filteredUsers = useMemo(
        () =>
            users
                ?.filter((x) => x.id.toString().includes(selectedUserId ?? ''))
                .slice(0, 10)
                .map((u) => u.id) ?? [],
        [users, selectedUserId],
    );

    if (userId) {
        return (
            <>
                <Chip label={userId} color="primary" variant="outlined" icon={<AccountCircle />} />
                <Button color="inherit" onClick={logout}>
                    Log out
                </Button>
            </>
        );
    }

    return (
        <>
            <Button color="inherit" onClick={() => setIsOpen(!isOpen)}>
                Login
            </Button>
            <Dialog open={isOpen}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>Pick or create a user from the list</DialogContentText>
                    <Autocomplete
                        disableClearable
                        options={filteredUsers ?? []}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                onChange={(e) => {
                                    setSelectedUserId(e.target.value);
                                    return e;
                                }}
                                InputProps={{ ...params.InputProps }}
                            />
                        )}
                        value={selectedUserId}
                        onChange={(_, value) => setSelectedUserId(value ?? '')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button
                        onClick={async () => {
                            await login(selectedUserId as string);
                            setIsOpen(false);
                        }}
                        disabled={!selectedUserId}
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
