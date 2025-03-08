import { knex } from '../../../connections/knex';
import { Property } from '../properties/model';

export const countApplicationInteractions = async (applicationId: number) => {
    const { count } = await knex('interactions').withSchema(`apps_${applicationId}`).count().first<{ count: number }>();
    return count;
};

export const findApplicationInteractions = async (applicationId: number) => {
    return knex('interactions').withSchema(`apps_${applicationId}`).orderBy('created_at', 'desc').limit(25);
};

export const findApplicationInteractionProperties = async (applicationId: number) => {
    return knex('interaction_properties').withSchema(`apps_${applicationId}`);
};

export const insertApplicationInteractionProperty = async (applicationId: number, property: Omit<Property, 'id'>) => {
    const [result] = await knex('interaction_properties')
        .withSchema(`apps_${applicationId}`)
        .insert(property)
        .returning('*');
    return result;
};

export const deleteApplicationInteractionPropertyById = async (applicationId: number, propertyId: number) => {
    return knex('interaction_properties').withSchema(`apps_${applicationId}`).where({ id: propertyId }).delete();
};
