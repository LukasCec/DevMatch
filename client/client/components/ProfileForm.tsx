'use client';

import { useEffect, useRef, useState } from 'react';
import { authFetch } from '@/lib/api';
import { Dialog } from '@headlessui/react';
import { Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

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

const levelOptions = ['Junior', 'Mid', 'Senior'];

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        await authFetch('http://localhost:5000/api/user/me', {
            method: 'PUT',
            body: JSON.stringify(form),
        });
        alert('Profile saved!');
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

    if (loading) return <p className="text-gray-600">Loading profile...</p>;

    return (
        <div className="space-y-8">

            <div onClick={() => setIsModalOpen(true)} className="relative w-24 h-24 cursor-pointer ">
                <img
                    src={form.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border"
                />
                <button
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Pencil className="cursor-pointer" size={16} />
                </button>
            </div>


            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <FormGroup label="Tech Stack">
                    <input
                        type="text"
                        name="techStack"
                        value={form.techStack.join(', ')}
                        onChange={handleTechStackChange}
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="input"
                    />
                </FormGroup>

                <FormGroup label="Goal">
                    <input
                        type="text"
                        name="goal"
                        value={form.goal}
                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        placeholder="e.g. Looking for an open source teammate"
                        className="input"
                    />
                </FormGroup>

                <FormGroup label="Experience Level">
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="w-full text-left px-4 py-2 bg-white input rounded-lg shadow-sm flex justify-between items-center text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                            whileTap={{ scale: 0.98 }}
                        >
                            {form.level || 'Select level'}
                            <motion.span
                                variants={iconVariants}
                                animate={dropdownOpen ? 'open' : 'closed'}
                            >
                                ▼
                            </motion.span>
                        </motion.button>

                        <motion.ul
                            initial="closed"
                            animate={dropdownOpen ? 'open' : 'closed'}
                            variants={wrapperVariants}
                            className="absolute z-50 w-full mt-2 p-2 rounded-lg shadow-lg bg-white "
                        >
                            {levelOptions.map((level) => (
                                <motion.li
                                    key={level}
                                    variants={itemVariants}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 duration-300 rounded-md cursor-pointer"
                                    onClick={() => {
                                        setForm({ ...form, level: level.toLowerCase() });
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {level}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                </FormGroup>

                <FormGroup label="Availability">
                    <input
                        type="text"
                        name="availability"
                        value={form.availability}
                        onChange={(e) => setForm({ ...form, availability: e.target.value })}
                        placeholder="e.g. evenings, weekends"
                        className="input"
                    />
                </FormGroup>

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Save Profile
                </button>
            </form>


            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
                        <Dialog.Title className="text-lg font-semibold text-gray-800">
                            Choose an avatar
                        </Dialog.Title>
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

                        <div>
                            <label className="block text-sm font-semibold mb-1">Custom URL</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="https://..."
                                value={customAvatarUrl}
                                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                            />
                            <button
                                className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition"
                                onClick={() => handleAvatarSelect(customAvatarUrl)}
                            >
                                Use URL
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}


function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
            {children}
        </div>
    );
}


const wrapperVariants = {
    open: {
        scaleY: 1,
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.08,
        },
    },
    closed: {
        scaleY: 0,
        opacity: 0,
        transition: {
            when: 'afterChildren',
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
    },
    closed: {
        opacity: 0,
        y: -10,
    },
};

const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};
