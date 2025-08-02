'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

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
            alert('Registration successful! You can now sign in.');
            router.push('/login');
        } else {
            const data = await res.json();
            alert(`Error: ${data.message || 'Registration failed'}`);
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
                Sign-Up
            </motion.h1>

            <motion.input
                className="input mb-2 p-2 border w-full"
                type="text"
                name="name"
                placeholder="Username"
                value={form.name}
                onChange={handleChange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            />

            <motion.input
                className="input mb-2 p-2 border w-full"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            />

            <motion.input
                className="input mb-4 p-2 border w-full"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            />

            <motion.button
                className="bg-blue-600 hover:bg-blue-700 duration-300 text-white px-4 py-2 rounded w-full"
                onClick={handleRegister}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Sign-Up
            </motion.button>
        </motion.div>
    );
}
