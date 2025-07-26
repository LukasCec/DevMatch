'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';

export default function ProfilePage() {
    const [form, setForm] = useState({
        techStack: [] as string[],
        goal: '',
        level: '',
        availability: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await authFetch('http://localhost:5000/api/users/me');
            setForm({
                techStack: data.techStack || [],
                goal: data.goal || '',
                level: data.level || '',
                availability: data.availability || '',
            });
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map((tag) => tag.trim());
        setForm({ ...form, techStack: tags });
    };

    const handleSubmit = async () => {
        await authFetch('http://localhost:5000/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(form),
        });
        alert('Profil uložený!');
    };

    if (loading) return <p>Načítavam profil...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Môj profil</h1>

            <label className="block mb-2 font-semibold">Technológie (oddelené čiarkou)</label>
            <input
                className="w-full mb-4 p-2 border"
                type="text"
                name="techStack"
                value={form.techStack.join(', ')}
                onChange={handleTechStackChange}
                placeholder="napr. React, Node.js, MongoDB"
            />

            <label className="block mb-2 font-semibold">Cieľ</label>
            <input
                className="w-full mb-4 p-2 border"
                type="text"
                name="goal"
                value={form.goal}
                onChange={handleChange}
                placeholder="napr. Chcem parťáka na open source"
            />

            <label className="block mb-2 font-semibold">Úroveň</label>
            <select
                className="w-full mb-4 p-2 border"
                name="level"
                value={form.level}
                onChange={handleChange}
            >
                <option value="">-- vyber úroveň --</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
            </select>

            <label className="block mb-2 font-semibold">Dostupnosť</label>
            <input
                className="w-full mb-4 p-2 border"
                type="text"
                name="availability"
                value={form.availability}
                onChange={handleChange}
                placeholder="napr. večery, víkendy, CET"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                Uložiť profil
            </button>
        </div>
    );
}
