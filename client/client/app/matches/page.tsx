'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { User } from '@/types/user';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
        <motion.div
            className="max-w-4xl mx-auto py-12 px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                className="text-3xl font-bold text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Your Matches 💙
            </motion.h1>

            {matches.length === 0 ? (
                <motion.p
                    className="text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    You don’t have any matches yet 😢
                </motion.p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {matches.map((user, index) => (
                        <motion.div
                            key={user._id}
                            className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center text-center hover:shadow-lg transition"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                        >
                            <Image
                                src={user.avatar || '/avatars/avatar1.png'}
                                alt={user.name}
                                width={80}
                                height={80}
                                className="rounded-full object-cover mb-3"
                            />
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-600 mb-2">
                                {user.goal || 'No goal specified'}
                            </p>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>
                                    <strong>Level:</strong> {user.level || 'N/A'}
                                </p>
                                <p>
                                    <strong>Availability:</strong> {user.availability || 'N/A'}
                                </p>
                                <p>
                                    <strong>Tech stack:</strong>{' '}
                                    {user.techStack?.join(', ') || 'N/A'}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
