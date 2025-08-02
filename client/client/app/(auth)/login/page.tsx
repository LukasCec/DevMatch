'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    interface JWTPayload {
        id: string;
        email: string;
        name: string;
    }

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
            alert('Invalid login credentials');
        }
    };

    return (
        <motion.div
            className="max-w-md mx-auto mt-20"
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

            <motion.input
                className="input mb-2 p-2 border w-full"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            />

            <motion.input
                className="input mb-4 p-2 border w-full"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            />

            <motion.button
                className="bg-blue-600 hover:bg-blue-700 duration-300 text-white px-4 py-2 rounded w-full"
                onClick={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Sign-In
            </motion.button>
        </motion.div>
    );
}
