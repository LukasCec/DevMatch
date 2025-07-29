'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        authFetch('http://localhost:5000/api/user/me').then(setUser);
    }, []);

    if (!user) return <div>Načítavam...</div>;

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Vitaj, {user.name} 👋</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Technológie:</strong> {user.techStack?.join(', ') || '–'}</p>
        </div>
    );
}
