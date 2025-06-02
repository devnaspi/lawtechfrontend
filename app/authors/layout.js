import { Inter } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AuthorLayout from './AuthorLayout';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Author Portal - Praelex Intel',
    description: 'Manage your articles and author profile on Praelex Intel',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>          
                    <AuthorLayout>{children}</AuthorLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
