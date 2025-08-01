'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        authFetch('http://localhost:5000/api/user/me').then(setUser);
    }, []);

    if (!user) return <div>Loading...</div>;



    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="flex-1  flex flex-col justify-center items-center px-6 text-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
                    Welcome to <span className="text-blue-600">DevMatch</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-8">
                    Meet new developers, build connections, and chat with people who share your passion for code ✨
                </p>
                <Link
                    href="/discover"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                    Get started
                </Link>
            </section>

            {/* Benefits */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Why DevMatch?</h2>
                    <div className="grid sm:grid-cols-3 gap-10 text-center">
                        <div className="flex flex-col items-center">
                            <Image className="" src="/icons/chat.png" alt="Chat icon" width={140} height={140} />
                            <h3 className="text-xl font-semibold mt-4 mb-2">Real-time Chat</h3>
                            <p className="text-gray-600 text-sm max-w-xs">
                                Thanks to modern technologies, you can message others instantly without delay.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Image src="/icons/connect.png" alt="Connect icon" width={140} height={140} />
                            <h3 className="text-xl font-semibold mt-4 mb-2">Connect with Devs</h3>
                            <p className="text-gray-600 text-sm max-w-xs">
                                Match based on skills and interests. Your future collaborators are waiting.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Image src="/icons/profile.png" alt="Profile icon" width={140} height={140} />
                            <h3 className="text-xl font-semibold mt-4 mb-2">Build Your Profile</h3>
                            <p className="text-gray-600 text-sm max-w-xs">
                                Introduce yourself and let others know who you are and what you're working on.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
