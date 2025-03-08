import { chain, isMatch, pick } from 'lodash';
import { useState } from 'react';
import { makeContext } from '../lib/context';

export type Selection = {
    matchId: string;
    marketId: string;
    outcomeId: string;
};

export const [BetslipProvider, useBetslip, BetslipConsumer] = makeContext(() => {
    const [selections, setSelections] = useState<Selection[]>([]);

    const addToBetslip = (selection: Selection) => {
        setSelections(
            chain([...selections, selection])
                .reverse()
                .uniqWith((a, b) => isMatch(a, pick(b, ['matchId', 'marketId'])))
                .reverse()
                .value(),
        );
    };

    const removeFromBetslip = (selection: Partial<Selection>) => {
        setSelections(selections.filter((x) => !isMatch(x, selection)));
    };

    const clearBetslip = () => {
        setSelections([]);
    };

    const isInBetslip = (selection: Partial<Selection>) => {
        return selections.some((x) => isMatch(x, selection));
    };

    return { selections, addToBetslip, removeFromBetslip, clearBetslip, isInBetslip };
});
