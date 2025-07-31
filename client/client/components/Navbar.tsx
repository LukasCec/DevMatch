'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    FiChevronDown,
    FiEdit,
    FiLogOut,
} from 'react-icons/fi';

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
    const [mobileOpen, setMobileOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

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


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white border-neutral-100 shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="text-xl font-bold text-blue-600">DevMatch</Link>


            <button className="sm:hidden text-gray-700" onClick={() => setMobileOpen(true)}>
                <Menu className="w-6 h-6" />
            </button>


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


                        <motion.div animate={dropdownOpen ? 'open' : 'closed'} className="relative">
                            <div
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded transition cursor-pointer"
                            >
                                <img
                                    src={
                                        user.avatar?.startsWith('http')
                                            ? user.avatar
                                            : `${user.avatar || '/avatars/avatar1.png'}`
                                    }
                                    onError={(e) =>
                                        ((e.currentTarget as HTMLImageElement).src = '/avatars/avatar1.png')
                                    }
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm font-medium text-gray-800">{user.name}</span>
                                <motion.span variants={iconVariants}>
                                    <FiChevronDown />
                                </motion.span>
                            </div>

                            <motion.ul
                                initial={wrapperVariants.closed}
                                variants={wrapperVariants}
                                style={{ originY: 'top', translateX: '-50%' }}
                                className="absolute top-[142%] left-[20%] w-48 p-2 rounded-lg bg-white shadow-xl z-50 overflow-hidden"
                            >
                                <Option
                                    Icon={FiEdit}
                                    text="Edit profile"
                                    onClick={() => {
                                        router.push('/profile');
                                        setDropdownOpen(false);
                                    }}
                                />
                                <Option
                                    Icon={FiLogOut}
                                    text="Logout"
                                    red
                                    onClick={() => {
                                        handleLogout();
                                        setDropdownOpen(false);
                                    }}
                                />
                            </motion.ul>
                        </motion.div>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link href="/login" className="text-sm text-blue-600 hover:underline">Sign in</Link>
                        <Link href="/register" className="text-sm text-blue-600 hover:underline">Sign up</Link>
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            <div
                className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
                    mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            >
                <div
                    ref={overlayRef}
                    className={`absolute top-0 right-0 w-64 h-full bg-white p-6 shadow-lg transform transition-transform duration-300 ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-blue-600">Menu</span>
                        <X className="w-6 h-6 cursor-pointer" onClick={() => setMobileOpen(false)} />
                    </div>

                    {user ? (
                        <>
                            {navItems.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block text-sm font-medium mb-2 ${
                                        pathname === href ? 'text-blue-600' : 'text-gray-700'
                                    } hover:text-blue-500 transition`}
                                >
                                    {label}
                                </Link>
                            ))}
                            <div className="border-t pt-3 mt-3">
                                <button
                                    onClick={() => {
                                        router.push('/profile');
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-500"
                                >
                                    <FiEdit className="w-4 h-4" />
                                    Edit profile
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mt-2"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block text-sm text-blue-600 mb-2 hover:underline">Sign in</Link>
                            <Link href="/register" className="block text-sm text-blue-600 hover:underline">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const Option = ({
                    text,
                    Icon,
                    onClick,
                    red = false,
                }: {
    text: string;
    Icon: React.ElementType;
    onClick: () => void;
    red?: boolean;
}) => (
    <motion.li
        variants={itemVariants}
        onClick={onClick}
        className={`flex items-center gap-2 w-full p-2 text-sm font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 ${
            red ? 'text-red-600 hover:text-red-700' : 'text-slate-700 hover:text-indigo-500'
        } transition-colors cursor-pointer`}
    >
        <motion.span variants={actionIconVariants}>
            <Icon />
        </motion.span>
        <span>{text}</span>
    </motion.li>
);

// Framer Motion variants
const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: 'afterChildren',
            staggerChildren: 0.05,
        },
    },
};

const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: { when: 'beforeChildren' },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: { when: 'afterChildren' },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};
