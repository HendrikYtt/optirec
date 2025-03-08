import { Chip, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { ManagePropertiesButton } from '../components/ManagePropertiesButton';
import { useDelete, useGet, usePost } from '../hooks/use-api';
import { BaseLayout } from '../layout/BaseLayout';
import { CreatePropertySchema, Item, Property } from '../schemas/application';

export const DatabaseUsersPage: FC = () => {
    const { databaseId } = useParams();
    const [properties, loadProperties] = useGet<Property[]>(`/applications/${databaseId}/users/properties`);
    const [{ count } = { count: 0 }, loadUsersCount] = useGet<{ count: number }>(
        `/applications/${databaseId}/users/count`,
    );
    const [users, loadUsers] = useGet<Item[]>(`/applications/${databaseId}/users`);

    const after = () => Promise.all([loadProperties(), loadUsers(), loadUsersCount()]);

    const [createProperty] = usePost<CreatePropertySchema>(`/applications/${databaseId}/users/properties`, {
        after,
    });
    const [deleteProperty] = useDelete((id: number) => `/applications/${databaseId}/users/properties/${id}`, {
        after,
    });

    return (
        <BaseLayout>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" columnGap={1}>
                    <Typography variant="h4">Users</Typography>
                    <Chip label={`${count} users`} />
                </Stack>

                <ManagePropertiesButton
                    title="User Properties"
                    properties={properties ?? []}
                    onCreate={createProperty}
                    onDelete={deleteProperty}
                />
            </Stack>
            <Paper>
                <DataGrid
                    columns={[
                        { field: 'id', headerName: 'ID', width: 90 },
                        ...(properties?.map(({ name, type }) => ({
                            field: name,
                            headerName: name,
                            width: 200,
                            renderHeader: () => (
                                <Stack direction="row" columnGap={1} alignItems="center">
                                    <div>{name}</div>
                                    <Chip label={type} size="small" />
                                </Stack>
                            ),
                        })) ?? []),
                    ]}
                    rows={users?.map(({ id, attributes }) => ({ id, ...attributes })) ?? []}
                    autoHeight
                />
            </Paper>
        </BaseLayout>
    );
};
