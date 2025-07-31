'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

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
            alert('Neplatné prihlasovacie údaje');
        }
    };
    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Prihlásenie</h1>
            <input className="input mb-2 p-2 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input className="input mb-4 p-2 " type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLogin}>Prihlásiť sa</button>
        </div>
    );
}
