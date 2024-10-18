import { Inter } from 'next/font/google';
import '../globals.css';
import ClientLayout from './ClientLayout';
import { AuthProvider } from '@/context/AuthContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Law Tech',
  description: 'Law tech',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>          
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
