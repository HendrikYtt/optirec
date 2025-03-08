import { Chip, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { ManagePropertiesButton } from '../components/ManagePropertiesButton';
import { useDelete, useGet, usePost } from '../hooks/use-api';
import { BaseLayout } from '../layout/BaseLayout';
import { CreatePropertySchema, Interaction, Property } from '../schemas/application';

export const DatabaseInteractionsPage: FC = () => {
    const { databaseId } = useParams();
    const [properties, loadProperties] = useGet<Property[]>(`/applications/${databaseId}/interactions/properties`);
    const [{ count } = { count: 0 }, loadInteractionsCount] = useGet<{ count: number }>(
        `/applications/${databaseId}/interactions/count`,
    );
    const [interactions, loadInteractions] = useGet<Interaction[]>(`/applications/${databaseId}/interactions`);

    const after = () => Promise.all([loadProperties(), loadInteractions(), loadInteractionsCount()]);

    const [createProperty] = usePost<CreatePropertySchema>(`/applications/${databaseId}/interactions/properties`, {
        after,
    });
    const [deleteProperty] = useDelete((id: number) => `/applications/${databaseId}/interactions/properties/${id}`, {
        after,
    });

    return (
        <BaseLayout>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" columnGap={1}>
                    <Typography variant="h4">Interactions</Typography>
                    <Chip label={`${count} interactions`} />
                </Stack>

                <ManagePropertiesButton
                    title="Interaction Properties"
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
                    rows={interactions?.map(({ id, attributes }) => ({ id, ...attributes })) ?? []}
                    autoHeight
                />
            </Paper>
        </BaseLayout>
    );
};
