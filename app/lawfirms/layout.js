// app/lawfirms/layout.js (Server Component)
import { Inter } from 'next/font/google';
import '../globals.css'; // Use the same global CSS or create a specific one for the law firm portal
import LawFirmSidebar from './components/LawFirmSidebar'; // Import the sidebar for the law firm portal

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Law Firm Portal - Law Tech',
    description: 'Manage authors, contracts, and more on Law Tech',
};

export default function LawFirmLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    {/* Sidebar with fixed positioning */}
                    <div style={{ position: 'fixed', width: '250px', height: '100vh', top: 0, left: 0 }}>
                        <LawFirmSidebar />
                    </div>
                    {/* Main content area */}
                    <main style={{ marginLeft: '250px', flexGrow: 1, padding: '20px', paddingTop: '0px' }}>
                        {children} {/* Render the specific law firm page content here */}
                    </main>
                </div>
            </body>
        </html>
    );
}
