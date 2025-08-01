'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { User } from '@/types/user';
import {
    motion,
    useMotionValue,
    useTransform,
    AnimatePresence,
    useAnimation,
} from 'framer-motion';
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
            setMessage(``);
        }

        setUsers((prev) => prev.filter((u) => u._id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <motion.h1
                className="text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Discover Developers
            </motion.h1>

            {message && (
                <motion.p
                    className="text-green-600 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
            )}

            <div className="relative w-full max-w-md h-[460px]">
                <AnimatePresence mode="wait">
                    {users.length > 0 ? (
                        <SwipeCard
                            key={users[0]._id}
                            user={users[0]}
                            onSwipe={(dir) => {
                                const userId = users[0]._id;

                                if (dir === 'right') {
                                    authFetch(`http://localhost:5000/api/match/${userId}`, {
                                        method: 'POST',
                                    }).then((res) =>
                                        setMessage(``)
                                    );
                                }

                                setTimeout(() => {
                                    setUsers((prev) => prev.filter((u) => u._id !== userId));
                                }, 300);
                            }}
                        />
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
    onSwipe: (dir: 'left' | 'right') => void;
}) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const background = useTransform(
        x,
        [-150, 0, 150],
        ['#fee2e2', '#ffffff', '#d1fae5']
    );

    const controls = useAnimation();
    const [swiped, setSwiped] = useState<null | 'left' | 'right'>(null);

    useEffect(() => {
        controls.start({ scale: 1, opacity: 1, y: 0 });
    }, [controls]);

    const handleDragEnd = async (_: any, info: any) => {
        if (info.offset.x > 150) {
            setSwiped('right');
            await controls.start({ x: 1000, opacity: 0 });
        } else if (info.offset.x < -150) {
            setSwiped('left');
            await controls.start({ x: -1000, opacity: 0 });
        } else {
            await controls.start({ x: 0 });
        }
    };

    return (
        <motion.div
            className="absolute w-full h-full rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center"
            style={{ x, rotate, background }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={controls}
            exit={{ opacity: 0, scale: 0.8 }}
            onAnimationComplete={() => {
                if (swiped) {
                    onSwipe(swiped);
                }
            }}
        >
            <Image
                src={user.avatar || '/avatars/avatar1.png'}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {user.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
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
    );
}
