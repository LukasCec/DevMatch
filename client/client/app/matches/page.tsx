'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { User } from '@/types/user';
import UserCard from '@/components/UserCard';

export default function MatchesPage() {
    const [matches, setMatches] = useState<User[]>([]);

    useEffect(() => {
        const fetchMatches = async () => {
            const res = await authFetch('http://localhost:5000/api/match');
            setMatches(res);
        };
        fetchMatches();
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Tvoje matchy 💙</h1>

            {matches.length === 0 ? (
                <p>Nemáš zatiaľ žiadne matchy 😢</p>
            ) : (
                matches.map((user) => (
                    <UserCard key={user._id} user={user} />
                ))
            )}
        </div>
    );
}
