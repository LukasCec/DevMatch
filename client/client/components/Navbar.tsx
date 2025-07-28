'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/discover', label: 'Objavuj' },
    { href: '/matches', label: 'Matchy' },
    { href: '/chat', label: 'Chat' },
    { href: '/profile', label: 'Môj profil' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoggedIn(!!token);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10">
            <Link href="/" className="text-xl font-bold text-blue-600">DevMatch</Link>

            {loggedIn ? (
                <div className="flex gap-4 items-center">
                    {navItems.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm font-medium ${pathname === href ? 'text-blue-600' : 'text-gray-700'} hover:underline`}
                        >
                            {label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Odhlásiť sa</button>
                </div>
            ) : (
                <div className="flex gap-4">
                    <Link href="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
                    <Link href="/register" className="text-sm text-blue-600 hover:underline">Register</Link>
                </div>
            )}
        </nav>
    );
}
