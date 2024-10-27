'use client';

import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import AdminSidebar from './components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack';


export default function AdminLayout({ children }) {
    const router = useRouter();
    const { auth, loading } = useAuth();
    const pathname = usePathname();
    const noLayoutRoutes = ['/admin/signin', '/admin/signup'];
    const [authChecked, setAuthChecked] = useState(false);

    let shouldShowLayout = !noLayoutRoutes.includes(pathname);

    useEffect(() => {
        if (!loading) {
            if (!auth.isAuthenticated && !noLayoutRoutes.includes(pathname)) {
                router.push('/admin/signin');
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

    return (
        <>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    {shouldShowLayout && (
                        <>
                            <div style={{ position: 'fixed', width: '250px', height: '100vh', top: 0, left: 0 }}>
                                <AdminSidebar />
                            </div>

                            <main style={{ marginLeft: '250px', flexGrow: 1, padding: '20px', paddingTop: '0px'}}>
                                {children}
                            </main>
                        </>
                    )}

                    {!shouldShowLayout && <main style={{ flexGrow: 1 }}>{children}</main>}
                </div>
            </SnackbarProvider>
        </>
    );
}