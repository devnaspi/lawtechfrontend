'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import { useSnackbar } from 'notistack';
import { usePathname, useRouter } from 'next/navigation';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleApiError } = useApiErrorHandler();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const pathname = usePathname();

    const [auth, setAuth] = useState({
        token: null,
        user: null,
        isAuthenticated: false,
        profileType: null,
        error: null
    });
    const [loading, setLoading] = useState(true);

    const urlProfileTypeMap = {
        '/readers': 'client',
        '/authors': 'author',
        '/lawfirms': 'lawfirm',
        '/admin': 'admin'
    };

    const validateProfileTypeWithURL = (profileType) => {
        const matchingUrlPrefix = Object.entries(urlProfileTypeMap)
            .find(([_, type]) => type === profileType)?.[0];

        if (!matchingUrlPrefix) return true;

        // Check if the current pathname starts with the matching URL prefix
        const isValidURL = pathname.startsWith(matchingUrlPrefix);

        if (!isValidURL) {
            // Logout if the URL doesn't match the profile type
            enqueueSnackbar("Invalid access. Redirecting to login.", { variant: 'error' });
            logout();
            return false;
        }

        return true;
    };

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
    
            // Validate profile type against current URL before setting auth
            if (validateProfileTypeWithURL(profileType)) {
                setAuth({
                    token,
                    user: response.data,
                    isAuthenticated: true,
                    profileType,
                });
    
                localStorage.setItem('token', token);
                localStorage.setItem('profileType', profileType);
            }
    
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
        
        const loginPaths = {
            'client': '/readers/login',
            'author': '/authors/login',
            'lawfirm': '/lawfirms/login',
            'admin': '/admin/login'
        };

        const loginPath = loginPaths[auth.profileType] || '/';
        router.push(loginPath);
    };
    
    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
