'use client';

import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/AppAppBar';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Signin from './components/Signin';
import Signup from './components/Signup';
import OTPVerification from './components/OTPVerification';
import CompleteRegistration from './components/CompleteRegistration';
import { useRouter } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import { useAuth } from '@/context/AuthContext';

export default function ClientLayout({ children }) {
    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const [openOTPModal, setOpenOTPModal] = useState(false);
    const [openCompleteRegistrationModal, setOpenCompleteRegistrationModal] = useState(false);

    const [email, setEmail] = useState(''); // Email to be passed between steps
    const [showAppBar, setShowAppBar] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { auth, loading } = useAuth();

    useEffect(() => {
        if (pathname === '/readers/login') {
            setOpenSignUpModal(false);
            setOpenSignInModal(true);
            setOpenOTPModal(false);
            setOpenCompleteRegistrationModal(false);
        } else if (pathname === '/readers/sign-up') {
            setOpenSignUpModal(true);
            setOpenSignInModal(false);
            setOpenOTPModal(false);
            setOpenCompleteRegistrationModal(false);
        } else {
            setOpenSignInModal(false);
            setOpenSignUpModal(false);
            setOpenOTPModal(false);
            setOpenCompleteRegistrationModal(false);
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
        setOpenOTPModal(false);
        setOpenCompleteRegistrationModal(false);
        router.push('/readers/');
    };

    const handleOTPSuccess = (verifiedEmail) => {
        setEmail(verifiedEmail);
        setOpenOTPModal(false);
        setOpenCompleteRegistrationModal(true);
    };

    const handleSignupSuccess = (userEmail) => {
        setEmail(userEmail);
        setOpenSignUpModal(false);
        setOpenOTPModal(true);
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
                <Signup 
                    open={openSignUpModal} 
                    handleClose={handleCloseModals} 
                    onOTPSuccess={handleSignupSuccess}
                />
                <OTPVerification 
                    open={openOTPModal} 
                    handleClose={handleCloseModals} 
                    email={email}
                    onVerificationSuccess={handleOTPSuccess}
                />
                <CompleteRegistration 
                    open={openCompleteRegistrationModal} 
                    handleClose={handleCloseModals} 
                    email={email}
                />

                <ProgressBar height="2px" color="green" options={{ showSpinner: false }} shallowRouting />
            </SnackbarProvider>
        </>
    );
}
