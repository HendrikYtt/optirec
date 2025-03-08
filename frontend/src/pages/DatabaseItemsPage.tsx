import { Chip, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { ManagePropertiesButton } from '../components/ManagePropertiesButton';
import { useDelete, useGet, usePost } from '../hooks/use-api';
import { BaseLayout } from '../layout/BaseLayout';
import { CreatePropertySchema, Item, Property } from '../schemas/application';

export const DatabaseItemsPage: FC = () => {
    const { databaseId } = useParams();
    const [properties, loadProperties] = useGet<Property[]>(`/applications/${databaseId}/items/properties`);
    const [{ count } = { count: 0 }, loadItemsCount] = useGet<{ count: number }>(
        `/applications/${databaseId}/items/count`,
    );
    const [items, loadItems] = useGet<Item[]>(`/applications/${databaseId}/items`);

    const after = () => Promise.all([loadProperties(), loadItems(), loadItemsCount()]);

    const [createItemProperty] = usePost<CreatePropertySchema>(`/applications/${databaseId}/items/properties`, {
        after,
    });
    const [deleteProperty] = useDelete((id: number) => `/applications/${databaseId}/items/properties/${id}`, {
        after,
    });

    return (
        <BaseLayout>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" columnGap={1}>
                    <Typography variant="h4">Items</Typography>
                    <Chip label={`${count} items`} />
                </Stack>

                <ManagePropertiesButton
                    title="Item Properties"
                    properties={properties ?? []}
                    onCreate={createItemProperty}
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
                    rows={items?.map(({ id, attributes }) => ({ id, ...attributes })) ?? []}
                    autoHeight
                />
            </Paper>
        </BaseLayout>
    );
};
