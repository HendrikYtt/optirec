import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import { Item, Recommendation } from '../api/demo';
import { theme } from '../themes';
import { PlaygroundResultElement } from './PlaygroundResultElement';

type Props = {
    recommendations: (Recommendation & { similar_items: Recommendation[] })[];
    itemById: Record<string, Item>;
    attributes: string[];
};

export const options = {
    title: 'Scores',
    hAxis: { title: 'Score', textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
    vAxis: { minValue: 0, textStyle: { color: '#FFF' } },
    chartArea: { width: '50%', height: '70%' },
    backgroundColor: theme.palette.background.paper,
    titleTextStyle: { color: '#7ee629' },
    colors: ['#7ee629'],
    legend: { position: 'none' },
};

export const PlaygroundResult = ({ recommendations, itemById, attributes }: Props) => {
    return (
        <>
            <Typography variant="h4">Collaborative Filtering</Typography>

            {/* <Chart
                chartType="AreaChart"
                width="100%"
                height="400px"
                data={recommendations.map((val, index) => {
                    if (index === 0) return ['score', 'count'];
                    return [val.score, val.id];
                })}
                options={options}
            /> */}
            {recommendations.map(({ id, score, similar_items }) => {
                const item = itemById[id];
                return (
                    <Accordion key={id} style={{ borderRadius: theme.shape.borderRadius }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <PlaygroundResultElement attributes={attributes} item={item} score={score} />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1}>
                                {similar_items.map(({ id, score }) => {
                                    const item = itemById[id];
                                    return (
                                        <PlaygroundResultElement
                                            attributes={attributes}
                                            item={item}
                                            score={score}
                                            size="small"
                                        />
                                    );
                                })}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </>
    );
};
