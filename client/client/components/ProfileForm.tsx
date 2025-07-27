'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';

interface FormData {
    techStack: string[];
    goal: string;
    level: string;
    availability: string;
}

export default function ProfileForm() {
    const [form, setForm] = useState<FormData>({
        techStack: [],
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map((t) => t.trim());
        setForm({ ...form, techStack: tags });
    };

    const handleSubmit = async () => {
        await authFetch('http://localhost:5000/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(form),
        });
        alert('Profil bol uložený!');
    };

    if (loading) return <p>Načítavam profil...</p>;

    return (
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
    );
}
