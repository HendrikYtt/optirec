export type Application = {
    id: number;
    account_id: number;
    name: string;
    created_at: Date;
};

export type ApplicationKey = {
    id: number;
    application_id: number;
    key: string;
    created_at: Date;
    last_used_at: Date;
};

export type ApplicationSchema = {
    application_id: number;
    key: string;
    type: 'category';
};
