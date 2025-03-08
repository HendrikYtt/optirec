import { Box, Typography } from '@mui/material';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import { Item } from '../api/demo';
import { formatAttribute } from '../services/playground';

type Props = {
    attributes: string[];
    itemById: Record<string, Item>;
    selectionModel: GridSelectionModel;
    setSelectionModel: (selectionModel: GridSelectionModel) => void;
};

export const PlaygroundSelections = ({ attributes, itemById, selectionModel, setSelectionModel }: Props) => {
    return (
        <>
            <Typography variant="h6">Your selections</Typography>

            <Box height={400} width="100%">
                <DataGrid
                    columns={[
                        { field: 'id', headerName: 'ID', width: 100 },
                        { field: 'title', headerName: 'Title', width: 200 },
                        ...attributes.map((attribute) => ({
                            field: attribute,
                            headerName: formatAttribute(attribute),
                            width: 180,
                        })),
                    ]}
                    rows={selectionModel.map((id) => ({
                        id,
                        title: itemById[id]?.title,
                        ...itemById[id]?.attributes,
                    }))}
                    checkboxSelection
                    selectionModel={selectionModel}
                    onSelectionModelChange={setSelectionModel}
                />
            </Box>
        </>
    );
};
