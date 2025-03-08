import { MODELS_HOST } from '../../../config';
import { http } from '../../../lib/rest';

export type Recommendation = { id: string; title: string; score: number };

export const recommendItems = (schema: string, model: string, query: Record<string, string>) =>
    http.get<Recommendation[]>(`${MODELS_HOST}/schemas/${schema}/models/${model}/items`, query);

export const recommendSimilarItems = (schema: string, model: string, itemId: string, query: Record<string, string>) =>
    http.get<Recommendation[]>(`${MODELS_HOST}/schemas/${schema}/models/${model}/items/${itemId}/items`, query);

export const recommendItemsForUser = (schema: string, model: string, userId: string, query: Record<string, string>) =>
    http.get<Recommendation[]>(`${MODELS_HOST}/schemas/${schema}/models/${model}/users/${userId}/items`, query);

export type Topic = { kind: 'recent' | 'string'; value: string };

export const recommendTopicsForUser = (schema: string, userId: string) =>
    http.get<Topic[]>(`${MODELS_HOST}/schemas/${schema}/users/${userId}/topics`);
