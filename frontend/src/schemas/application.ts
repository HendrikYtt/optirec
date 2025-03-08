export type ApplicationResponseSchema = {
    id: number;
    account_id: string;
    name: string;
    created_at: string;
};

export type GetApiKeyResponseSchema = {
    id: number;
    application_id: number;
    key: string;
    created_at: string;
    last_used_at: string;
};

export type PostApiKeyResponseSchema = {
    key: string;
};

export enum PropertyType {
    CATEGORY = 'CATEGORY',
    CATEGORY_LIST = 'CATEGORY_LIST',
}

export type Property = {
    id: number;
    name: string;
    type: PropertyType;
};

export type CreatePropertySchema = { name: string; type: PropertyType };

export type Item = {
    id: string;
    attributes: Record<string, string>;
};

export type Interaction = {
    id: string;
    user_id: string;
    item_id: string;
    rating?: number;
    attributes: Record<string, string>;
    created_at: string;
};
