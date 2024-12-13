'use client';

import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import AppAppBar from './components/AppAppBar';
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
import { ThemeProvider } from '@mui/material/styles';
import createAppTheme from '../components/theme';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


export default function ClientLayout({ children }) {
    const [hydrated, setHydrated] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const [theme, setTheme] = useState(createAppTheme(false)); 

    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
    const [openOTPModal, setOpenOTPModal] = useState(false);
    const [openOTPModalForForgotPassword, setOpenOTPModalForForgotPassword] = useState(false);
    const [openCompleteRegistrationModal, setOpenCompleteRegistrationModal] = useState(false);
    const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
    const [email, setEmail] = useState('');
    const [showAppBar, setShowAppBar] = useState(true);

    const router = useRouter();
    const pathname = usePathname();
    const { auth, loading } = useAuth();


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
        if (pathname === '/readers/login') {
            setOpenSignUpModal(false);
            setOpenSignInModal(true);
            setOpenForgotPasswordModal(false);
            setOpenOTPModal(false);
            setOpenResetPasswordModal(false); 
            setOpenCompleteRegistrationModal(false);
        } else if (pathname === '/readers/sign-up') {
            setOpenSignUpModal(true);
            setOpenSignInModal(false);
            setOpenForgotPasswordModal(false);
            setOpenOTPModal(false);
            setOpenResetPasswordModal(false);
            setOpenCompleteRegistrationModal(false);
        } else if (pathname === '/readers/forgot-password') {
            setOpenSignUpModal(false);
            setOpenSignInModal(false);
            setOpenOTPModal(false);
            setOpenCompleteRegistrationModal(false);
            setOpenForgotPasswordModal(true); 
            setOpenResetPasswordModal(false); 
        } else if (pathname === '/readers/reset-password') {
            setOpenSignUpModal(false);
            setOpenSignInModal(false);
            setOpenForgotPasswordModal(false); 
            setOpenOTPModal(false);
            setOpenCompleteRegistrationModal(false);
            setOpenResetPasswordModal(true); 
        } else {
            setOpenSignInModal(false);
            setOpenSignUpModal(false);
            setOpenForgotPasswordModal(false);
            setOpenOTPModal(false);
            setOpenCompleteRegistrationModal(false);
            setOpenResetPasswordModal(false);
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
        setOpenForgotPasswordModal(false)
        setOpenCompleteRegistrationModal(false);
        setOpenResetPasswordModal(false)
        router.push('/readers/');
    };

    const handleOTPSuccess = (verifiedEmail) => {
        setEmail(verifiedEmail);
        setOpenOTPModal(false);
        setOpenCompleteRegistrationModal(true);
    };

    const handleOTPSuccessForForgotPassword = (verifiedEmail) => {
        setEmail(verifiedEmail);
        setOpenOTPModalForForgotPassword(false);
        setOpenResetPasswordModal(true);
    };

    const handleForgotPasswordOtpSent = (verifiedEmail) => {
        setEmail(verifiedEmail);
        setOpenForgotPasswordModal(false);
        setOpenOTPModalForForgotPassword(true);
    };

    const handleSignupSuccess = (userEmail) => {
        setEmail(userEmail);
        setOpenSignUpModal(false);
        setOpenOTPModal(true);
    };

    if (!hydrated) return null;

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <CssBaseline />
                <NavBar />
                {showAppBar && <AppAppBar />}

                <main>{children}</main>

                <Footer />

                <Signin open={openSignInModal} handleClose={handleCloseModals} />
                
                <Signup open={openSignUpModal} handleClose={handleCloseModals} onOTPSuccess={handleSignupSuccess} />
                <OTPVerification open={openOTPModal} handleClose={handleCloseModals} email={email} onVerificationSuccess={handleOTPSuccess} />
                <CompleteRegistration open={openCompleteRegistrationModal} handleClose={handleCloseModals} email={email} />

                <ForgotPassword open={openForgotPasswordModal} handleClose={handleCloseModals} onOTPSuccess={handleForgotPasswordOtpSent} />
                <OTPVerification open={openOTPModalForForgotPassword} handleClose={handleCloseModals} email={email} onVerificationSuccess={handleOTPSuccessForForgotPassword} />
                <ResetPassword open={openResetPasswordModal} handleClose={handleCloseModals} email={email} />

                <ProgressBar height="2px" color="green" options={{ showSpinner: false }} shallowRouting />
            </SnackbarProvider>
        </ThemeProvider>
    );
}
