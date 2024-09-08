// app/authors/layout.js (Server Component)
import { Inter } from 'next/font/google';
import '../globals.css'; // Create and use a specific global CSS for the authors' portal
import AuthorSidebar from './components/AuthorSidebar'; // Import a sidebar or navigation specific to the authors

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Author Portal - Law Tech',
    description: 'Manage your articles and profile on Law Tech',
};

export default function AuthorLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    {/* Sidebar with fixed positioning */}
                    <div style={{ position: 'fixed', width: '250px', height: '100vh', top: 0, left: 0 }}>
                        <AuthorSidebar />
                    </div>
                    {/* Main content area */}
                    <main style={{ marginLeft: '250px', flexGrow: 1, padding: '20px', paddingTop: '0px'}}>
                        {children} {/* Render the specific law firm page content here */}
                    </main>
                </div>
            </body>
        </html>
    );
}
