'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { User } from '@/types/user';
import UserCard from '@/components/UserCard';

export default function DiscoverPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        authFetch('http://localhost:5000/api/discover').then(setUsers);
    }, []);

    const handleLike = async (id: string) => {
        const res = await authFetch(`http://localhost:5000/api/match/${id}`, {
            method: 'POST',
        });
        setMessage(res.message);
        setUsers((prev) => prev.filter((u) => u._id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Objav vývojárov</h1>
            {message && <p className="text-green-600 mb-4">{message}</p>}

            {users.length === 0 ? (
                <p>Žiadni ďalší používatelia 😢</p>
            ) : (
                users.map((user) => (
                    <UserCard key={user._id} user={user} onLike={() => handleLike(user._id)} showLike />
                ))
            )}
        </div>
    );
}
