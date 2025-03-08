import { Close, Star } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useIsCompact } from '../hooks/is-compact';
import { useQuery } from '../hooks/query';
import { getMatchById, recommendSimilarMatches } from '../services/optirec';
import { MarketType } from './MarketType';
import { MatchList } from './MatchList';

type MatchProps = { id: string };

export const Match = ({ id }: MatchProps) => {
    const theme = useTheme();
    const isCompact = useIsCompact();
    const [match] = useQuery(() => getMatchById(id), [id]);
    const [similarRecommendations, { setResult: setSimilarRecommendations, load: loadSimilarRecommendations }] =
        useQuery(() => recommendSimilarMatches(id), [id], { loadOnMount: false });

    const handleSimilar = async () => {
        await loadSimilarRecommendations();
    };

    if (!match) {
        return null;
    }
    return (
        <Stack>
            <Stack
                direction={isCompact ? 'column' : 'row'}
                alignItems="center"
                justifyContent="space-between"
                columnGap={2}
                rowGap={1}
                py={1}
                px={2}
                sx={{ backgroundColor: theme.palette.background.paper }}
            >
                <Stack sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.disabled">
                        {match.attributes.sport} / {match.attributes.region} / {match.attributes.league}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                            <Typography>{match.attributes.team[0]}</Typography>
                            <Typography>{match.attributes.team[1]}</Typography>
                        </Stack>
                        <Tooltip title="Similar events" arrow>
                            <IconButton size="small" onClick={handleSimilar}>
                                <Star fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" columnGap={1}>
                    <Stack direction="row" columnGap={1}>
                        <MarketType matchId={match.id} name="Match Result (1x2)" />
                        {!isCompact && (
                            <>
                                <MarketType matchId={match.id} name="Total Goals" />
                                <MarketType matchId={match.id} name="Handicap (3 way)" />
                            </>
                        )}
                    </Stack>
                </Stack>
            </Stack>
            {!!similarRecommendations?.length && (
                <Stack p={1} rowGap={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" px={1}>
                        <Typography variant="caption" color="text.secondary">
                            Users also place bets on
                        </Typography>
                        <IconButton size="small" onClick={() => setSimilarRecommendations([])}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Stack>
                    <MatchList recommendations={similarRecommendations} />
                </Stack>
            )}
        </Stack>
    );
};
