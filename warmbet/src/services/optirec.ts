import { memoize } from 'lodash';
import { v4 } from 'uuid';
import { Page } from '../hooks/paginate';
import { createHttp } from '../lib/http';

const {
    REACT_APP_BASE_URL = 'https://integrations.optirec.ml',
    REACT_APP_TOKEN = 'dd205121-437e-4f51-b1d6-cef9e3c1359e',
} = process.env;

const http = createHttp({
    baseUrl: REACT_APP_BASE_URL,
    headers: { 'X-Token': REACT_APP_TOKEN },
});

export type Match = {
    id: string;
    attributes: {
        sport: string;
        league: string;
        region: string;
        team: string;
    };
};

export const getMatchById = memoize(async (id: string) => {
    return http.get<Match>(`/items/${id}`);
});

type User = {
    id: string;
    attributes: {
        country: string;
    };
};

export const findUsers = async () => {
    return http.get<User[]>('/users');
};

export const sendUser = async (user: User) => {
    return http.post<User>('/users', user);
};

export type Interaction = {
    id: string;
    user_id: string;
    item_id: string;
    attributes: {
        market_type: string;
    };
};

export const findInteractions = async (userId: string) => {
    return http.get<Interaction[]>(`/interactions?userId=${userId}&limit=100`);
};

export const sendInteractions = async (interaction: Omit<Interaction, 'id'>) => {
    return http.post('/interactions', {
        id: v4(),
        rating: 1,
        ...interaction,
    });
};

export type Recommendation = {
    id: string;
    score: number;
};

type Filters = {
    user__country?: string;
    item__sport?: string;
    item__region?: string;
    item__league?: string;
    item__team?: string;
};

export const recommendPopularMatchesByCountry = (country: string, page: Page) => {
    return http.get<Recommendation[]>(`/recommendations/popularity-by-country/items`, { ...page, country });
};

export const recommendPopularMatches = (filters: Filters, page: Page) => {
    return http.get<Recommendation[]>(`/recommendations/popularity/items`, { ...filters, ...page });
};

export const recommendHighestRatingMatches = (page: Page) => {
    return http.get<Recommendation[]>(`/recommendations/rating/items`, page);
};

export const recommendMatchesBasedOnContent = (userId: string, page: Page) =>
    http.get<Recommendation[]>(`/recommendations/attribute/users/${userId}/items`, page);

export const recommendMatchesBasedOnCollaborativeFiltering = (userId: string, page: Page) => {
    return http.get<Recommendation[]>(`/recommendations/als/users/${userId}/items`, page);
};

export const recommendSimilarMatches = async (itemId: string) => {
    return http.get<Recommendation[]>(`/recommendations/als/items/${itemId}/items`);
};

export const recommendRecentMatches = async (userId: string, page: Page) => {
    return http.get<Recommendation[]>(`/recommendations/recent/users/${userId}/items`, page);
};

export type Topic = {
    kind: 'recent' | 'sport' | 'region' | 'league' | 'team';
    value: string;
};

export const recommendTopics = async (userId: string) => {
    return http.get<Topic[]>(`/recommendations/topics/users/${userId}`);
};
