'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function ClientLayout({ children }) {
    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const [openOTPModal, setOpenOTPModal] = useState(false);
    const [openCompleteRegistrationModal, setOpenCompleteRegistrationModal] = useState(false);
    const [email, setEmail] = useState('');
    const [showAppBar, setShowAppBar] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

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
            },
        });
    }, [darkMode]);    
    

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

                <ProgressBar height="2px" color="green" options={{ showSpinner: false }} shallowRouting />
            </SnackbarProvider>
        </ThemeProvider>
    );
}
