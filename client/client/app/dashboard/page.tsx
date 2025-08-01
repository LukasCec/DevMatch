'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        authFetch('http://localhost:5000/api/user/me').then(setUser);
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col justify-center items-center px-6 text-center"
            >
                <motion.h1
                    className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Welcome to <span className="text-blue-600">DevMatch</span>
                </motion.h1>
                <motion.p
                    className="text-lg sm:text-xl text-gray-600 max-w-xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    Meet new developers, build connections, and chat with people who share your passion for code ✨
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        href="/discover"
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Get started
                    </Link>
                </motion.div>
            </motion.section>

            {/* Benefits */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
                className="py-16 px-6 bg-white"
            >
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h2
                        className="text-3xl font-bold mb-12"
                        variants={fadeInUp}
                        transition={{ delay: 0.1 }}
                    >
                        Why DevMatch?
                    </motion.h2>
                    <div className="grid sm:grid-cols-3 gap-10 text-center">
                        {benefits.map(({ icon, title, text }, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                transition={{ delay: 0.2 + i * 0.2 }}
                                className="flex flex-col items-center"
                            >
                                <Image src={icon} alt={`${title} icon`} width={140} height={140} />
                                <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
                                <p className="text-gray-600 text-sm max-w-xs">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}


const benefits = [
    {
        icon: '/icons/chat.png',
        title: 'Real-time Chat',
        text: 'Thanks to modern technologies, you can message others instantly without delay.',
    },
    {
        icon: '/icons/connect.png',
        title: 'Connect with Devs',
        text: 'Match based on skills and interests. Your future collaborators are waiting.',
    },
    {
        icon: '/icons/profile.png',
        title: 'Build Your Profile',
        text: "Introduce yourself and let others know who you are and what you're working on.",
    },
];


const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const sectionVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};
