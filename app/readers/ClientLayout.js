'use client';

import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/AppAppBar';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Signin from './components/Signin';
import Signup from './components/Signup';
import { useRouter } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import { useAuth } from '@/context/AuthContext';

export default function ClientLayout({ children }) {
    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const [showAppBar, setShowAppBar] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { auth, loading } = useAuth();

    useEffect(() => {
        if (pathname === '/readers/login') {
            setOpenSignUpModal(false);
            setOpenSignInModal(true);
        } else if (pathname === '/readers/sign-up') {
            setOpenSignUpModal(true);
            setOpenSignInModal(false);
        } else {
            setOpenSignInModal(false);
            setOpenSignUpModal(false);
        }

        setShowAppBar(pathname !== '/readers/profile');

        const protectedRoutes = ['/readers/contracts', '/readers/profile'];

        if (!loading) {
            if (protectedRoutes.includes(pathname) && !auth.isAuthenticated) {
                router.push('/readers/login');
            }
        }
    }, [pathname, auth.isAuthenticated, loading, router]);

    const handleCloseModals = () => {
        setOpenSignInModal(false);
        setOpenSignUpModal(false);
        router.push('/readers/');
    };

    return (
        <>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <CssBaseline />
                <NavBar />
                {showAppBar && <AppAppBar />}
                
                <main>{children}</main>
                
                <Footer />

                <Signin open={openSignInModal} handleClose={handleCloseModals} />
                <Signup open={openSignUpModal} handleClose={handleCloseModals} />
                
                <ProgressBar height="2px" color="green" options={{ showSpinner: false }} shallowRouting />
            </SnackbarProvider>
        </>
    );
}
