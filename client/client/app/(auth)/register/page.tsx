'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            showNotification('success', 'Registration successful! You can now sign in.');
            setTimeout(() => router.push('/login'), 1500);
        } else {
            const data = await res.json();
            showNotification('error', data.message || 'Registration failed');
        }
    };

    return (
        <motion.div
            className="max-w-md mx-auto mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-2xl font-bold mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                Sign-Up
            </motion.h1>

            <input
                className="input mb-2 p-2 border w-full"
                type="text"
                name="name"
                placeholder="Username"
                value={form.name}
                onChange={handleChange}
            />
            <input
                className="input mb-2 p-2 border w-full"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />
            <input
                className="input mb-4 p-2 border w-full"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />

            <button
                className="bg-blue-600 hover:bg-blue-700 duration-300 text-white px-4 py-2 rounded w-full"
                onClick={handleRegister}
            >
                Sign-Up
            </button>

            <AnimatePresence>
                {notification && (
                    <NotificationModal
                        type={notification.type}
                        message={notification.message}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function NotificationModal({
                               type,
                               message,
                           }: {
    type: 'success' | 'error';
    message: string;
}) {
    const colors = {
        success: 'bg-green-100 text-green-800 border-green-400',
        error: 'bg-red-100 text-red-800 border-red-400',
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-0 left-0 right-0 mx-auto w-full text-center border px-4 py-3 rounded mb-4 shadow ${colors[type]}`}
        >
            {message}
        </motion.div>
    );
}
