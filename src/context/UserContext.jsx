import {createContext, useContext, useState} from 'react';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            let parsed = JSON.parse(savedUser)
            parsed.token = localStorage.getItem('authToken');
            // Добавляем временную зону по умолчанию
            parsed.timezone = parsed.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
            return parsed;
        } else return {
            id: null,
            phone: null,
            name: null,
            token: null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    });

    const [isAuth, setIsAuth] = useState(() => {
        return localStorage.getItem('isAuth') === 'true';
    });

    const login = (userData) => {
        const newUser = {
            id: userData.id,
            phone: userData.phone,
            name: userData.name,
            // Сохраняем временную зону при логине
            timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        setUser(newUser);
        setIsAuth(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('authToken', '952f6175b48b6f93c4e800878251187a739e7185');
    };

    const logout = () => {
        setUser({id: null, phone: null, name: null});
        setIsAuth(false);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuth');
        localStorage.removeItem('authToken');
    };

    return (
        <UserContext.Provider value={{user, isAuth, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};