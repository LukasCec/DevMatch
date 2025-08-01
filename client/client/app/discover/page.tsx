'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { User } from '@/types/user';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function DiscoverPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        authFetch('http://localhost:5000/api/discover').then(setUsers);
    }, []);

    const handleSwipe = async (direction: 'left' | 'right', id: string) => {
        if (direction === 'right') {
            const res = await authFetch(`http://localhost:5000/api/match/${id}`, {
                method: 'POST',
            });
            setMessage(res.message);
        }

        setUsers((prev) => prev.filter((u) => u._id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Discover Developers</h1>
            {message && <p className="text-green-600 mb-4">{message}</p>}

            <div className="relative w-full max-w-md h-[460px]">
                <AnimatePresence>
                    {users.length > 0 ? (
                        <SwipeCard user={users[0]} onSwipe={handleSwipe} />
                    ) : (
                        <motion.div
                            key="no-users"
                            className="absolute inset-0 bg-white rounded-xl shadow flex items-center justify-center text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No more users 😢
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SwipeCard({
                       user,
                       onSwipe,
                   }: {
    user: User;
    onSwipe: (dir: 'left' | 'right', id: string) => void;
}) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 150) {
            onSwipe('right', user._id);
        } else if (info.offset.x < -150) {
            onSwipe('left', user._id);
        }
    };

    return (
        <motion.div
            key={user._id}
            className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center"
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
        >
            <Image
                src={user.avatar || '/avatars/avatar1.png'}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h2>
            <p className="text-sm text-gray-600 mb-3">{user.goal || 'No goal specified'}</p>
            <div className="text-xs text-gray-500">
                <p><strong>Level:</strong> {user.level || 'N/A'}</p>
                <p><strong>Availability:</strong> {user.availability || 'N/A'}</p>
                <p><strong>Tech stack:</strong> {user.techStack?.join(', ') || 'N/A'}</p>
            </div>
        </motion.div>
    );
}
