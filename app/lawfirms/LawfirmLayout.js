'use client';

import { useEffect, useState, useMemo } from 'react';
import '../globals.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack';
import LawFirmSidebar from './components/LawFirmSidebar';
import { ThemeProvider } from '@mui/material/styles';
import createAppTheme from '../components/theme';
import { CssBaseline } from '@mui/material';


export default function LawfirmLayout({ children }) {
    const [hydrated, setHydrated] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [theme, setTheme] = useState(createAppTheme(false)); 
    
    const router = useRouter();
    const { auth, loading } = useAuth();
    const pathname = usePathname();
    const noLayoutRoutes = ['/lawfirms/signin', '/lawfirms/signup', '/lawfirms/forgot-password', '/lawfirms/verify-otp', '/lawfirms/reset-password'];
    const [authChecked, setAuthChecked] = useState(false);

    let shouldShowLayout = !noLayoutRoutes.includes(pathname);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (event) => {
            setDarkMode(event.matches);
        };

        setDarkMode(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);

        setHydrated(true);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        setTheme(createAppTheme(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (!loading) {
            if (!auth.isAuthenticated && !noLayoutRoutes.includes(pathname)) {
                router.push('/lawfirms/signin');
            } else {
                if (auth.isAuthenticated) {
                    shouldShowLayout = true
                }
                setAuthChecked(true);
            }
        }
    }, [pathname, auth.isAuthenticated, loading, router]);


    if (loading || !authChecked) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hydrated) return null;

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <CssBaseline />    

                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    {shouldShowLayout && (
                        <>
                            {/* Sidebar */}
                            <div style={{ position: 'fixed', width: '250px', height: '100vh', top: 0, left: 0 }}>
                                <LawFirmSidebar />
                            </div>

                            {/* Main content area */}
                            <main style={{ marginLeft: '250px', flexGrow: 1, padding: '20px', paddingTop: '0px'}}>
                                {children}
                            </main>
                        </>
                    )}

                    {!shouldShowLayout && <main style={{ flexGrow: 1 }}>{children}</main>}
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
