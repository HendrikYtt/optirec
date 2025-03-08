import { randomUUID } from 'crypto';
import { Request } from 'express';
import { ApiError, ApplicationError } from '../../constants/errors';
import { ForbiddenError, NotFoundError } from '../../lib/errors';
import {
    deleteApplicationKeyById,
    findApplicationByApplicationKeyCached,
    findApplicationById,
    findApplicationKeyById,
    findApplicationKeysByApplicationId,
    findApplicationsByAccountId,
    insertApplication,
    insertApplicationKey,
    updateApplicationKey,
} from './repository';
import { CreateApplicationSchema } from './schema';

export const getUserApplicationOrThrow = async (accountId: number, applicationId: number) => {
    const app = await getApplicationByIdOrThrow(applicationId);
    if (app.account_id !== accountId) {
        throw new NotFoundError(ApplicationError.ApplicationNotFound);
    }
    return app;
};

export const getApplicationByIdOrThrow = async (id: number) => {
    const application = await findApplicationById(id);
    if (!application) {
        throw new NotFoundError(ApplicationError.ApplicationNotFound);
    }
    return application;
};

export const getApplicationsByAccountId = async (accountId: number) => {
    return findApplicationsByAccountId(accountId);
};

export const getApplicationKeysByApplicationId = async (applicationId: number) => {
    const applicationKeys = await findApplicationKeysByApplicationId(applicationId);
    return applicationKeys.map(({ key, ...rest }) => ({ ...rest, key: hideApplicationKey(key) }));
};

export const createApplication = async ({ name }: CreateApplicationSchema, accountId: number) => {
    return insertApplication({ name, account_id: accountId });
};

export const createApplicationKey = async (applicationId: number) => {
    return insertApplicationKey({
        application_id: applicationId,
        key: randomUUID(),
    });
};

export const getApplicationByApiKey = async (req: Request<unknown>) => {
    const apiKey = <string>req.headers['x-token'];
    if (!apiKey) {
        throw new ForbiddenError(ApiError.RequiresApiKey);
    }
    const application = await findApplicationByApplicationKeyCached(apiKey);
    if (!application) {
        throw new ForbiddenError(ApiError.InvalidApiKey);
    }
    return application;
};

export const deleteApplicationKeyOrThrow = async (id: number) => {
    const apiKey = await deleteApplicationKeyById(id);
    if (!apiKey) {
        throw new NotFoundError(ApplicationError.ApiKeyNotFound);
    }
    return apiKey;
};

export const updateApplicationKeyById = async (id: number, lastUsedAt: Date) => {
    const applicationKey = await findApplicationKeyById(id);
    if (!applicationKey) {
        throw new NotFoundError(ApplicationError.ApplicationKeyNotFound);
    }
    return updateApplicationKey(id, lastUsedAt);
};

export const hideApplicationKey = (key: string) => {
    const length = key.length;
    return key.substring(0, 1) + '.'.repeat(3) + key.substring(length - 4, length);
};
