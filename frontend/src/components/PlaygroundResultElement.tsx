import { Chip, Stack, Typography } from '@mui/material';
import { Item } from '../api/demo';

export const PlaygroundResultElement = ({
    score,
    attributes,
    item,
    size,
}: {
    score: number;
    attributes: string[];
    item: Item;
    size?: 'small';
}) => (
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
        <Stack>
            <Typography>{item.title}</Typography>
            <Typography variant="body2">
                {attributes.map((attribute) => item.attributes[attribute]).join(' | ')}
            </Typography>
        </Stack>

        <Chip label={score.toFixed(2)} size={size} />
    </Stack>
);
