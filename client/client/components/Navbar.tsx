'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Pencil } from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/discover', label: 'Discover' },
    { href: '/matches', label: 'Matches' },
    { href: '/chat', label: 'Chat' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return setUser(null);

        fetch('http://localhost:5000/api/user/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };


    return (
        <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10">
            <Link href="/" className="text-xl font-bold text-blue-600">
                DevMatch
            </Link>

            {!user ? (
                <div className="flex gap-4">
                    <Link href="/login" className="text-sm text-blue-600 hover:underline">
                        Sign in
                    </Link>
                    <Link href="/register" className="text-sm text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-6 relative">
                    {navItems.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm font-medium ${
                                pathname === href ? 'text-blue-600' : 'text-gray-700'
                            } hover:text-blue-500 transition`}
                        >
                            {label}
                        </Link>
                    ))}


                    <div className="relative cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded transition">
                            <img
                                src={
                                    user.avatar?.startsWith('http')
                                        ? user.avatar
                                        : `${user.avatar || 'avatar1.png'}`
                                }
                                onError={(e) => (e.currentTarget.src = '/avatars/avatar1.png')}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />

                            <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        </div>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-white border shadow-md rounded w-40 z-50">
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
