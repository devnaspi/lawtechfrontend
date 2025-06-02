import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import '../globals.css';

import { AuthProvider } from '@/context/AuthContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Praelex Intel',
  description: 'Praelex Intel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} >
        <AuthProvider>          
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
