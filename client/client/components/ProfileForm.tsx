'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { Dialog } from '@headlessui/react';
import { Pencil } from 'lucide-react';

interface FormData {
    techStack: string[];
    goal: string;
    level: string;
    availability: string;
    avatar: string;
}

const defaultAvatars = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
];

export default function ProfileForm() {
    const [form, setForm] = useState<FormData>({
        techStack: [],
        goal: '',
        level: '',
        availability: '',
        avatar: '',
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customAvatarUrl, setCustomAvatarUrl] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await authFetch('http://localhost:5000/api/user/me');
            setForm({
                techStack: data.techStack || [],
                goal: data.goal || '',
                level: data.level || '',
                availability: data.availability || '',
                avatar: data.avatar || '/avatars/avatar1.png',
            });
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map((t) => t.trim());
        setForm({ ...form, techStack: tags });
    };

    const handleAvatarSelect = (url: string) => {
        setForm({ ...form, avatar: url });
        setIsModalOpen(false);
        setCustomAvatarUrl('');
    };

    const handleSubmit = async () => {
        await authFetch('http://localhost:5000/api/user/me', {
            method: 'PUT',
            body: JSON.stringify(form),
        });
        alert('Profil bol uložený!');
    };

    if (loading) return <p>Načítavam profil...</p>;

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            <div className="relative w-24 h-24">
                <img
                    src={form.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border"
                />
                <button
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Pencil size={16} />
                </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block font-semibold mb-1">Technológie</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        value={form.techStack.join(', ')}
                        onChange={handleTechStackChange}
                        placeholder="napr. React, Node.js, MongoDB"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Cieľ</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="goal"
                        value={form.goal}
                        onChange={handleChange}
                        placeholder="napr. Chcem parťáka na open source"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Úroveň</label>
                    <select
                        className="w-full p-2 border rounded"
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                    >
                        <option value="">-- vyber úroveň --</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Dostupnosť</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                        placeholder="napr. večery, víkendy"
                    />
                </div>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={handleSubmit}
                >
                    Uložiť profil
                </button>
            </form>

            {/* Avatar Selection Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded p-6 max-w-sm w-full space-y-4">
                        <Dialog.Title className="text-lg font-semibold">Vyber profilový obrázok</Dialog.Title>
                        <div className="grid grid-cols-4 gap-2">
                            {defaultAvatars.map((url) => (
                                <img
                                    key={url}
                                    src={url}
                                    onClick={() => handleAvatarSelect(url)}
                                    className="w-16 h-16 object-cover rounded-full cursor-pointer hover:ring-2 ring-blue-400"
                                    alt="avatar"
                                />
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block font-semibold mb-1">Vlastný URL</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="https://..."
                                value={customAvatarUrl}
                                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                            />
                            <button
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                onClick={() => handleAvatarSelect(customAvatarUrl)}
                            >
                                Použiť URL
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
