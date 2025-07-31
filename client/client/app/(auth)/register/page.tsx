'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
            alert('Registrácia prebehla úspešne! Môžeš sa prihlásiť.');
            router.push('/login');
        } else {
            const data = await res.json();
            alert(`Chyba: ${data.message || 'Nepodarilo sa registrovať'}`);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Sign-Up</h1>

            <input
                className="input mb-2 p-2 border"
                type="text"
                name="name"
                placeholder="Username"
                value={form.name}
                onChange={handleChange}
            />
            <input
                className="input mb-2 p-2 border"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />
            <input
                className="input mb-4 p-2 border"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />

            <button
                className="bg-blue-600 hover:bg-blue-700 duration-300 text-white px-4 py-2 rounded"
                onClick={handleRegister}
            >
                Sign-Up
            </button>
        </div>
    );
}
