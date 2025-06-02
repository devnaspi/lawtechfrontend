import { Inter } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '@/context/AuthContext';
import LawfirmLayout from './LawfirmLayout';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Law Firm Portal - Praelex Intel',
    description: 'Manage authors, contracts, and more on Praelex Intel',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>          
                    <LawfirmLayout>{children}</LawfirmLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
