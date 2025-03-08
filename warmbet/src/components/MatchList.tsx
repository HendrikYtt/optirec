import { ArrowDownward } from '@mui/icons-material';
import { Button, Stack, useTheme } from '@mui/material';
import { FC } from 'react';
import { Recommendation } from '../services/optirec';
import { Match } from './Match';

type MatchListProps = {
    hasMore?: boolean;
    loadMore?: () => void;
    recommendations?: Recommendation[];
    isLoading?: boolean;
};

export const MatchList: FC<MatchListProps> = ({ hasMore = false, loadMore, isLoading, recommendations = [] }) => {
    const theme = useTheme();

    if (!recommendations.length) {
        return null;
    }
    return (
        <Stack
            sx={{
                borderRadius: `${theme.shape.borderRadius}px`,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                overflow: 'hidden',
            }}
            rowGap="1px"
        >
            {recommendations.map((recommendation) => (
                <Match key={recommendation.id} id={recommendation.id} />
            ))}

            {hasMore && (
                <Button
                    size="small"
                    endIcon={<ArrowDownward fontSize="small" />}
                    color="inherit"
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                        borderRadius: 0,
                    }}
                    onClick={loadMore}
                    disabled={isLoading}
                >
                    Load more
                </Button>
            )}
        </Stack>
    );
};
