export enum PropertyType {
    CATEGORY = 'CATEGORY',
    CATEGORY_LIST = 'CATEGORY_LIST',
}

export type Property = {
    id: number;
    name: string;
    type: PropertyType;
};
