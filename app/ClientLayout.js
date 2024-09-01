// app/ClientLayout.js (Client Component)
'use client';

import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/readers/AppAppBar';
import NavBar from './components/readers/NavBar';
import Footer from './components/readers/Footer';
import Signin from './components/readers/Signin';
import Signup from './components/readers/Signup';
import { useRouter } from 'next/navigation';

export default function ClientLayout({ children }) {
const [openSignInModal, setOpenSignInModal] = useState(false);
const [openSignUpModal, setOpenSignUpModal] = useState(false);
const router = useRouter();

useEffect(() => {
    const path = window.location.pathname
    
    if (path === '/login') {
        setOpenSignUpModal(false);
        setOpenSignInModal(true);
    } else if (path === '/sign-up') {
        setOpenSignUpModal(true);
        setOpenSignInModal(false);
    } 
    
    else if (path.startsWith('/articles/') || path === '/') {} 
    else {
        router.push('/404');
    }
}, []);

const handleCloseModals = () => {
    router.push('/'); 
    window.location.reload()
};

return (
    <>
    <CssBaseline />
    <NavBar />
    <AppAppBar />
    
    {/* Render the page content */}
    <main>{children}</main>
    
    <Footer />

    {/* Sign In Modal */}
    <Signin open={openSignInModal} handleClose={handleCloseModals}/>

    {/* Sign Up Modal */}
    <Signup open={openSignUpModal} handleClose={handleCloseModals} />
</>
);
}
