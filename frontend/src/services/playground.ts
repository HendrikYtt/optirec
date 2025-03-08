export const formatAttribute = (attribute: string) => {
    return attribute
        .split('_')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};
