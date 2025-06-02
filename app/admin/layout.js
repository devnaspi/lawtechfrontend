import { Inter } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AdminLayout from './AdminLayout';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Admin Portal - Praelex Intel',
    description: 'Manage your articles and admin profile on Praelex Intel',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>          
                    <AdminLayout>{children}</AdminLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
