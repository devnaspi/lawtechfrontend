'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useSnackbar } from 'notistack';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleApiError } = useApiErrorHandler();
    const { enqueueSnackbar } = useSnackbar();

    const [auth, setAuth] = useState({
        token: null,
        user: null,
        isAuthenticated: false,
        profileType: null,
        error: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedProfileType = localStorage.getItem('profileType');

        if (savedToken && savedProfileType) {
            fetchProfile(savedToken, savedProfileType);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async (token, profileType) => {
        try {
            let profileUrl;
    
            switch (profileType) {
                case 'client':
                    profileUrl = '/api/users/profile/';
                    break;
                case 'author':
                    profileUrl = '/api/authors/profile/';
                    break;
                case 'lawfirm':
                    profileUrl = '/api/lawfirms/profile/';
                    break;
                case 'admin':
                    profileUrl = '/api/users/admin/profile';
                    break;
                default:
                    throw new Error('Unknown profile type');
            }
    
            const response = await axiosInstance.get(profileUrl, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
    
            setAuth({
                token,
                user: response.data,
                isAuthenticated: true,
                profileType,
            });
    
            localStorage.setItem('token', token);
            localStorage.setItem('profileType', profileType);
    
        } catch (error) {
            handleApiError(error);
            enqueueSnackbar("Unable to authenticate", { variant: 'error' });
    
            setAuth({
                token: null,
                user: null,
                isAuthenticated: false,
                profileType: null,
                error: error
            });
            logout();
        } finally {
            setLoading(false);
        }
    };    


    const login = async (token, profileType) => {
        await fetchProfile(token, profileType);
    };
    

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profileType');
    
        setAuth((prevAuth) => ({
            ...prevAuth,
            token: null,
            user: null,
            isAuthenticated: false,
            profileType: null,
        }));
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
