import { Box, Typography } from '@mui/material';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import { Item, Recommendation } from '../api/demo';
import { formatAttribute } from '../services/playground';

type Props = {
    title: string;
    precision: number;
    itemById: Record<string, Item>;
    recommendations: Recommendation[];
    attributes: string[];
    selectionModel: GridSelectionModel;
    setSelectionModel: (selectionModel: GridSelectionModel) => void;
};

export const PlaygroundRecommendations = ({
    title,
    precision,
    itemById,
    recommendations,
    attributes,
    selectionModel,
    setSelectionModel,
}: Props) => {
    return (
        <>
            <Typography variant="h6">{title}</Typography>

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
                        { field: 'score', headerName: 'Score', width: 110 },
                    ]}
                    rows={recommendations.map(({ id, score }) => ({
                        id,
                        title: itemById[id]?.title,
                        ...itemById[id]?.attributes,
                        score: score.toFixed(precision),
                    }))}
                    checkboxSelection
                    selectionModel={selectionModel}
                    onSelectionModelChange={setSelectionModel}
                />
            </Box>
        </>
    );
};
