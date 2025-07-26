// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DevMatch',
    description: 'Spoj sa s inými developermi a tvorte spolu!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="sk">
        <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </body>
        </html>
    );
}
