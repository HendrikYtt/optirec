import { HttpError } from './http';

export type ValidationDetails = {
    constraints: {
        [key: string]: string;
    }[];
}[];

export const parseValidationError = (error: HttpError) => {
    const { message } = error.body;

    if (!isValidationError(error)) {
        return message;
    }

    const { details } = error.body;

    const validationErrors = [];
    for (let i = 0; i < details.length; i++) {
        const constraints = details[i].constraints;
        for (const key in constraints) {
            const value = constraints[key];
            validationErrors.push(value);
        }
    }
    return capitalizeFirstLetter(validationErrors.toString().replace(/,/g, ', ').replace('_', ' '));
};

export const isValidationError = (error: HttpError): error is HttpError<ValidationDetails> => {
    return (error.body?.message as string) === 'ValidationError';
};

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
