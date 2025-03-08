import { keyBy } from 'lodash';
import { BadRequestError } from '../../lib/errors';
import { Property } from '../applications/properties/model';

export const validateAttributes = (attributes: Record<string, unknown>, properties: Property[]) => {
    const propertyByName = keyBy(properties, 'name');
    for (const key of Object.keys(attributes)) {
        const property = propertyByName[key];
        if (!property) {
            throw new BadRequestError(`Property ${key} is not configured`);
        }

        const value = attributes[key];
        if (value === null || value === undefined) {
            return;
        }

        const { type } = property;
        if (type === 'CATEGORY' && typeof value !== 'string') {
            throw new BadRequestError(`Property ${key} must be a string`);
        }
        if (type === 'CATEGORY_LIST' && (!Array.isArray(value) || value.some((x) => typeof x !== 'string'))) {
            throw new BadRequestError(`Property ${key} must be a string array`);
        }
    }
};
