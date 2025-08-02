'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    interface JWTPayload {
        id: string;
        email: string;
        name: string;
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleLogin = async () => {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            const decoded: JWTPayload = jwtDecode(data.token);
            localStorage.setItem('userId', decoded.id);
            router.push('/dashboard');
        } else {
            showNotification('error', 'Invalid login credentials');
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
                Sign-In
            </motion.h1>

            <input className="input mb-2 p-2 border w-full" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input className="input mb-4 p-2 border w-full" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <button className="bg-blue-600 hover:bg-blue-700 duration-300 text-white px-4 py-2 rounded w-full" onClick={handleLogin}>
                Sign-In
            </button>

            <AnimatePresence>
                {notification && (
                    <NotificationModal type={notification.type} message={notification.message} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function NotificationModal({ type, message }: { type: 'success' | 'error'; message: string }) {
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
            className={`absolute top-0 left-0 right-0 mx-auto w-full text-center border px-6 py-6 rounded mb-4 shadow ${colors[type]}`}
        >
            {message}
        </motion.div>
    );
}
