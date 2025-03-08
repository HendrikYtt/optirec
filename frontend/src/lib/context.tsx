import { createContext, FC, ReactNode, useContext } from 'react';

export const makeContext = <T,>(render: () => T) => {
    const MyContext = createContext<T>({} as T);

    const useMyContext = () => useContext(MyContext);

    const MyProvider: FC<{ children: ReactNode }> = ({ children }) => {
        const value = render();
        return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
    };

    return [MyProvider, useMyContext] as const;
};
