import { http } from '../lib/http';
import { ApplicationResponseSchema, GetApiKeyResponseSchema, PostApiKeyResponseSchema } from '../schemas/application';

export const addApplication = async (appName: string) =>
    http.post<ApplicationResponseSchema>('/applications', { name: appName });

export const getApplications = async () => http.get<ApplicationResponseSchema[]>('/applications');

export const createApplicationKey = async (applicationId: string) =>
    http.post<PostApiKeyResponseSchema>(`/applications/${applicationId}/keys`, {});

export const deleteApplicationKey = async (applicationKeyId: string) =>
    http.delete<GetApiKeyResponseSchema>(`/applications/keys/${applicationKeyId}`, {});

export const getApiKeysByApplicationId = async (applicationId: string) =>
    http.get<GetApiKeyResponseSchema[]>(`/applications/${applicationId}/keys`);
