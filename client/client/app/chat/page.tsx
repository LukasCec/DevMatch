'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
}

interface Message {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
}

const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload.id; // pozor: záleží od toho, ako si token generoval
    } catch (err) {
        return null;
    }
};

export default function ChatPage() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const otherUserId = searchParams.get('user');

    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        setCurrentUserId(getUserIdFromToken());
    }, []);

    useEffect(() => {
        authFetch('http://localhost:5000/api/match').then(setUsers);
    }, []);


    useEffect(() => {
        if (!otherUserId) return;

        const fetchMessages = async () => {
            const res = await authFetch(`http://localhost:5000/api/messages/${otherUserId}`);
            setMessages(res);
        };

        fetchMessages();
    }, [otherUserId]);

    const handleSend = async () => {
        if (!input.trim() || !otherUserId) return;

        await authFetch(`http://localhost:5000/api/messages/${otherUserId}`, {
            method: 'POST',
            body: JSON.stringify({ content: input }),
        });

        setInput('');
        const updated = await authFetch(`http://localhost:5000/api/messages/${otherUserId}`);
        setMessages(updated);
    };

    return (
        <div className="flex max-w-5xl mx-auto mt-10 h-[600px] border rounded overflow-hidden">

            <div className="w-1/3 border-r bg-gray-100 p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Konverzácie</h2>
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => router.push(`/chat?user=${user._id}`)}
                        className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${
                            user._id === otherUserId ? 'bg-blue-200' : ''
                        }`}
                    >
                        {user.name}
                    </div>
                ))}
            </div>


            <div className="flex-1 flex flex-col p-4">
                {otherUserId ? (
                    <>
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-2 rounded">
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`mb-2 p-2 rounded max-w-[80%] ${
                                        msg.sender === otherUserId
                                            ? 'bg-gray-200 self-start'
                                            : 'bg-blue-500 text-white self-end'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Napíš správu..."
                            />
                            <button
                                onClick={handleSend}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Poslať
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 self-center mt-20">Vyber si používateľa naľavo 👈</p>
                )}
            </div>
        </div>
    );
}
