import { knex } from '../../../connections/knex';
import { Property } from '../properties/model';

export const countApplicationItems = async (applicationId: number) => {
    const { count } = await knex('items').withSchema(`apps_${applicationId}`).count().first<{ count: number }>();
    return count;
};

export const findApplicationItems = async (applicationId: number) => {
    return knex('items').withSchema(`apps_${applicationId}`).orderBy('created_at', 'desc').limit(25);
};

export const findApplicationItemProperties = async (applicationId: number) => {
    return knex('item_properties').withSchema(`apps_${applicationId}`);
};

export const insertApplicationItemProperty = async (applicationId: number, property: Omit<Property, 'id'>) => {
    const [result] = await knex('item_properties').withSchema(`apps_${applicationId}`).insert(property).returning('*');
    return result;
};

export const deleteApplicationItemPropertyById = async (applicationId: number, propertyId: number) => {
    return knex('item_properties').withSchema(`apps_${applicationId}`).where({ id: propertyId }).delete();
};
