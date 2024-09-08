// app/ClientLayout.js (Client Component)
'use client';

import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/AppAppBar';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Signin from './components/Signin';
import Signup from './components/Signup';
import { useRouter } from 'next/navigation';

export default function ClientLayout({ children }) {
    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const path = window.location.pathname;
        
        if (path === '/readers/login') {
            setOpenSignUpModal(false);
            setOpenSignInModal(true);
        } else if (path === '/readers/sign-up') {
            setOpenSignUpModal(true);
            setOpenSignInModal(false);
        } else if (
            path.startsWith('/readers')     
            || path.startsWith('/readers/articles/') 
            || path === '/' 
            || path.startsWith('/readers/profile') 
            || path.startsWith('/readers/explore') 
            || path.startsWith('/readers/verification')
            || path.startsWith('/readers/contracts')
            || path.startsWith('/readers/lawfirms')
            ) {
            // Do nothing, allow the route
        } else {
            router.push('/readers/404');
        }
    }, []);

    const handleCloseModals = () => {
        router.push('/readers/'); 
        window.location.reload();
    };

    // Determine whether to show the AppBar based on the current path
    const showAppBar = window.location.pathname !== '/profile';

    return (
        <>
            <CssBaseline />
            <NavBar />
            {showAppBar && <AppAppBar />}
            
            {/* Render the page content */}
            <main>{children}</main>
            
            <Footer />

            {/* Sign In Modal */}
            <Signin open={openSignInModal} handleClose={handleCloseModals} />

            {/* Sign Up Modal */}
            <Signup open={openSignUpModal} handleClose={handleCloseModals} />
        </>
    );
}
