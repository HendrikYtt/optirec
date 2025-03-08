import { LoadingButton } from '@mui/lab';
import { LinearProgress } from '@mui/material';
import { Stack } from '@mui/system';
import { GridSelectionModel } from '@mui/x-data-grid';
import { keyBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { getPlaygroundRecommendations, listItems, recommendPopular, recommendRating } from '../api/demo';
import { useQuery } from '../hooks/query';
import { PlaygroundRecommendations } from './PlaygroundRecommendations';
import { PlaygroundResult } from './PlaygroundResult';
import { PlaygroundSelections } from './PlaygroundSelections';
import { UiTitle } from './ui/title/UiTitle';
export const Playground = () => {
    const [items] = useQuery(listItems);
    const [popularRecommendations] = useQuery(recommendPopular);
    const [ratingRecommendations] = useQuery(recommendRating);
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
    const [result, trainAndRecommend, { isLoading: isTraining }] = useQuery(
        () => getPlaygroundRecommendations(selectionModel as string[]),
        {
            loadOnMount: false,
        },
    );
    const [progress, setProgress] = useState(0);

    const itemById = useMemo(() => keyBy(items, 'id'), [items]);

    const attributes = useMemo(() => {
        if (!items?.length) return [];
        const { attributes } = items[0];
        return Object.keys(attributes);
    }, [items]);

    useEffect(() => {
        if (!isTraining) {
            setProgress(0);
            return;
        }

        const timer = setInterval(() => {
            setProgress((p) => p + 15);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [isTraining]);

    return (
        <Stack spacing={1} component="div">
            <UiTitle>Playground</UiTitle>

            {popularRecommendations && (
                <PlaygroundRecommendations
                    title="Popular"
                    precision={0}
                    itemById={itemById}
                    recommendations={popularRecommendations}
                    attributes={attributes}
                    selectionModel={selectionModel}
                    setSelectionModel={setSelectionModel}
                />
            )}

            {ratingRecommendations && (
                <PlaygroundRecommendations
                    title="Rating"
                    precision={2}
                    itemById={itemById}
                    recommendations={ratingRecommendations}
                    attributes={attributes}
                    selectionModel={selectionModel}
                    setSelectionModel={setSelectionModel}
                />
            )}

            <PlaygroundSelections
                attributes={attributes}
                itemById={itemById}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
            />

            <LoadingButton variant="contained" onClick={trainAndRecommend} loading={isTraining} loadingPosition="end">
                Train and Recommend
            </LoadingButton>

            {isTraining && <LinearProgress variant="determinate" value={progress} />}

            {result && (
                <PlaygroundResult
                    attributes={attributes}
                    itemById={itemById}
                    recommendations={result.collaborativeFiltering}
                />
            )}
        </Stack>
    );
};
