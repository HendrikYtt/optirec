export type Interaction = {
    id: string;
    user_id: string;
    item_id: string;
    rating?: number;
    attributes: Record<string, string>;
    created_at: string;
};
