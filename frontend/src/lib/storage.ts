type Storage = { token: string };

export const storage = {
    get: <K extends keyof Storage = keyof Storage>(key: K) => {
        const item = localStorage.getItem(key as string);
        if (item) {
            return JSON.parse(item) as Storage[K];
        }
    },
    set: <K extends keyof Storage = keyof Storage>(key: K, value: Storage[K]) =>
        localStorage.setItem(key, JSON.stringify(value)),
    del: (key: keyof Storage) => localStorage.removeItem(key),
};
