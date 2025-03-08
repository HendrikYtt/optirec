import { keyBy } from 'lodash';
import { useMemo } from 'react';
import { getMatchById } from '../services/optirec';
import { useQuery } from './query';

export const useMatchById = (matchIds: string[]) => {
    const [matches] = useQuery(() => Promise.all(matchIds.map((matchId) => getMatchById(matchId))), [matchIds]);

    const matchById = useMemo(() => keyBy(matches, 'id'), [matches]);

    return matchById;
};
