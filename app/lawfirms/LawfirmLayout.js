'use client';

import { useEffect, useState, useMemo } from 'react';
import '../globals.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack';
import LawFirmSidebar from './components/LawFirmSidebar';
import { createTheme, ThemeProvider } from '@mui/material/styles';



export default function LawfirmLayout({ children }) {
    const router = useRouter();
    const { auth, loading } = useAuth();
    const pathname = usePathname();
    const noLayoutRoutes = ['/lawfirms/signin', '/lawfirms/signup'];
    const [authChecked, setAuthChecked] = useState(false);
    const [darkMode, setDarkMode] = useState(false);


    let shouldShowLayout = !noLayoutRoutes.includes(pathname);

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

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: darkMode ? 'dark' : 'light',
                primary: {
                    main: '#ee8822',
                },
                background: {
                    default: darkMode ? '#121212' : '#fafafa',
                    paper: darkMode ? '#1e1e1e' : '#ffffff',
                    appBar: darkMode ? '#ffffff' : '#f5f5f5',
                },
                text: {
                    primary: darkMode ? '#ffffff' : '#000000',
                    secondary: darkMode ? '#eeeeee' : '#666666',
                },
                orange: {
                    100: '#ffcc80',
                    200: '#ffab66',
                    300: '#ff9900',
                },
            },
            typography: {
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            },
            components: {
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: darkMode ? '#ffffff' : 'transparent',
                        },
                    },
                },
                MuiLink: {
                    styleOverrides: {
                        root: {
                            color: darkMode ? '#e67e22' : '#ee8822',
                            '&:hover': {
                                color: darkMode ? '#ffab66' : '#d1761b',
                            },
                            textDecoration: 'none',
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            backgroundColor: 'transparent',
                            color: darkMode ? '#e67e22' : '#ee8822',
                            borderColor: '#e67e22',
                        },
                        deleteIcon: {
                        color: '#e67e22',
                        '&:hover': {
                            color: '#e67e22',
                        },
                        },
                    },
                },
            },
        });
    }, [darkMode]); 

    if (loading || !authChecked) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
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
