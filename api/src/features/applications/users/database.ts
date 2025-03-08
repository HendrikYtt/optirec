import { knex } from '../../../connections/knex';
import { Property } from '../properties/model';

export const countApplicationUsers = async (applicationId: number) => {
    const { count } = await knex('users').withSchema(`apps_${applicationId}`).count().first<{ count: number }>();
    return count;
};

export const findApplicationUsers = async (applicationId: number) => {
    return knex('users').withSchema(`apps_${applicationId}`).orderBy('created_at', 'desc').limit(25);
};

export const findApplicationUserProperties = async (applicationId: number) => {
    return knex('user_properties').withSchema(`apps_${applicationId}`);
};

export const insertApplicationUserProperty = async (applicationId: number, property: Omit<Property, 'id'>) => {
    const [result] = await knex('user_properties').withSchema(`apps_${applicationId}`).insert(property).returning('*');
    return result;
};

export const deleteApplicationUserPropertyById = async (applicationId: number, propertyId: number) => {
    return knex('user_properties').withSchema(`apps_${applicationId}`).where({ id: propertyId }).delete();
};
