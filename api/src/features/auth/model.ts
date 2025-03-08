export type Account = {
    id: number;
    email: string;
    password: string;
    created_at: Date;
};

export type AccountLoginHistory = {
    id: number;
    account_id: number;
    created_at: Date;
};

export type Session = {
    id: number;
    account_id: number;
    refresh_token: string;
    expires_at: Date;
    created_at: Date;
};
