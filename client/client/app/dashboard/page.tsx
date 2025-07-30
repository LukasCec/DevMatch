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

    if (!user) return <div>Načítavam...</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">

            <section className="flex-1 flex flex-col justify-center items-center px-6 text-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
                    Vitaj na <span className="text-blue-600">DevMatch</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-8">
                    Spoznaj nových vývojárov, buduj spojenia a chatuj s ľuďmi, ktorí zdieľajú tvoju vášeň pre kód ✨
                </p>
                <Link
                    href="/register"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                    Začni teraz
                </Link>
            </section>

            {/* Výhody */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Prečo DevMatch?</h2>
                    <div className="grid sm:grid-cols-3 gap-10 text-left">
                        <div>
                            <Image src="/icons/chat.svg" alt="Chat icon" width={40} height={40} />
                            <h3 className="text-xl font-semibold mt-4 mb-2">Chatuj v reálnom čase</h3>
                            <p className="text-gray-600 text-sm">
                                Vďaka moderným technológiám si píšeš s ostatnými bez zbytočného čakania.
                            </p>
                        </div>
                        <div>
                            <Image src="/icons/connect.svg" alt="Connect icon" width={40} height={40} />
                            <h3 className="text-xl font-semibold mt-4 mb-2">Spoj sa s devmi</h3>
                            <p className="text-gray-600 text-sm">
                                Matchni sa na základe zručností a záujmov. Tvoji noví kolegovia čakajú.
                            </p>
                        </div>
                        <div>
                            <Image src="/icons/profile.svg" alt="Profile icon" width={40} height={40} />
                            <h3 className="text-xl font-semibold mt-4 mb-2">Buduj svoj profil</h3>
                            <p className="text-gray-600 text-sm">
                                Predstav sa a nechaj ostatných zistiť, kto si a na čom pracuješ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 py-6">
                © {new Date().getFullYear()} DevMatch — Vybudované s ❤️ a kódom
            </footer>
        </div>
    );
}
