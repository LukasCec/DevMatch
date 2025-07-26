'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } else {
            alert('Neplatné prihlasovacie údaje');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Prihlásenie</h1>
            <input className="w-full mb-2 p-2 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full mb-4 p-2 border" type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLogin}>Prihlásiť sa</button>
        </div>
    );
}
