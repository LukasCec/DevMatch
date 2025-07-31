'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, Pencil, X } from 'lucide-react';

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return setUser(null);

        fetch('http://localhost:5000/api/user/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    // 👇 Zatvor menu po kliknutí mimo neho
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                overlayRef.current &&
                !overlayRef.current.contains(e.target as Node)
            ) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileMenuOpen]);

    return (
        <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="text-xl font-bold text-blue-600">
                DevMatch
            </Link>

            {/* Hamburger for mobile */}
            <button
                className="sm:hidden text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-6">
                {user ? (
                    <>
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
                        <div
                            className="relative cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded transition">
                                <img
                                    src={
                                        user.avatar?.startsWith('http')
                                            ? user.avatar
                                            : `${user.avatar || 'avatar1.png'}`
                                    }
                                    onError={(e) =>
                                        (e.currentTarget.src = '/avatars/avatar1.png')
                                    }
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm font-medium text-gray-800">
                  {user.name}
                </span>
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
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile menu (animated sliding + backdrop) */}
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
                    mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            >
                <div
                    ref={overlayRef}
                    className={`absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col gap-4 transform transition-transform duration-300 ${
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-blue-600">Menu</span>
                        <X
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                    </div>

                    {user ? (
                        <>
                            {navItems.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-medium ${
                                        pathname === href ? 'text-blue-600' : 'text-gray-700'
                                    } hover:text-blue-500 transition`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <Link
                                href="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center text-sm text-gray-700 hover:bg-gray-100 px-2 py-2 rounded"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit profile
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center text-sm text-red-600 hover:bg-gray-100 px-2 py-2 rounded"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
