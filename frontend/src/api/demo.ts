import { http } from '../lib/http';

export type Item = {
    id: string;
    title: string;
    created_at: string;
    attributes: Record<string, string>;
};

export const listItems = async () => http.get<Item[]>(`/demo/items`);

export type Recommendation = {
    id: string;
    score: number;
};

export const recommendPopular = async () => http.get<Recommendation[]>(`/demo/popular`);

export const recommendRating = async () => http.get<Recommendation[]>(`/demo/rating`);

export type PlaygroundRecommendation = {
    collaborativeFiltering: (Recommendation & { similar_items: Recommendation[] })[];
};

export const getPlaygroundRecommendations = async (itemIds: string[]) =>
    http.post<PlaygroundRecommendation>(`/demo/playground`, itemIds);
