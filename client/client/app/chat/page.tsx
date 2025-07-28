'use client';

import { useEffect, useRef, useState } from 'react';
import { authFetch } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import socket from '@/lib/socket';

interface User {
    _id: string;
    name: string;
}

interface Message {
    _id?: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt?: string;
}

const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch {
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
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [unread, setUnread] = useState<Record<string, number>>({}); // počet správ

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        socket.on('typing', (fromUserId: string) => {
            if (fromUserId === otherUserId) {
                setTyping(true);
            }
        });

        socket.on('stopTyping', (fromUserId: string) => {
            if (fromUserId === otherUserId) {
                setTyping(false);
            }
        });

        return () => {
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, [otherUserId]);

    useEffect(() => {
        const id = getUserIdFromToken();
        if (id) {
            setCurrentUserId(id);
            socket.connect();
            socket.emit('join', id);
        }

        return () => {
            socket.disconnect();
        };
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

    useEffect(() => {
        socket.on('newMessage', (msg: Message) => {
            if (msg.sender === otherUserId || msg.receiver === otherUserId) {
                setMessages((prev) => [...prev, msg]);
            } else {
                setUnread((prev) => ({
                    ...prev,
                    [msg.sender]: (prev[msg.sender] || 0) + 1,
                }));
            }
        });

        return () => {
            socket.off('newMessage');
        };
    }, [otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    let typingTimeout: NodeJS.Timeout;

    const handleTyping = () => {
        if (!currentUserId || !otherUserId) return;

        socket.emit('typing', { from: currentUserId, to: otherUserId });

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('stopTyping', { from: currentUserId, to: otherUserId });
        }, 1000);
    };

    const handleSend = async () => {
        if (!input.trim() || !otherUserId || !currentUserId) return;

        const message: Message = {
            sender: currentUserId,
            receiver: otherUserId,
            content: input,
        };

        socket.emit('sendMessage', message);

        await authFetch(`http://localhost:5000/api/messages/${otherUserId}`, {
            method: 'POST',
            body: JSON.stringify({ content: input }),
        });

        setInput('');
        const updated = await authFetch(`http://localhost:5000/api/messages/${otherUserId}`);
        setMessages(updated);
        scrollToBottom();
    };

    return (
        <div className="flex max-w-5xl mx-auto mt-10 h-[600px] border rounded overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 border-r bg-gray-100 p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Konverzácie</h2>
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => {
                            router.push(`/chat?user=${user._id}`);
                            setUnread((prev) => {
                                const updated = { ...prev };
                                delete updated[user._id];
                                return updated;
                            });
                        }}
                        className={`cursor-pointer p-2 rounded hover:bg-blue-100 flex justify-between items-center ${
                            user._id === otherUserId ? 'bg-blue-200' : ''
                        }`}
                    >
                        <span>{user.name}</span>
                        {unread[user._id] > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {unread[user._id]}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Chat window */}
            <div className="flex-1 flex flex-col p-4">
                {otherUserId ? (
                    <>
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-2 rounded flex flex-col">
                            {typing && (
                                <div className="text-sm text-blue-500 italic mb-2">Používateľ píše...</div>
                            )}
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-2 rounded max-w-[80%] ${
                                        msg.sender === currentUserId
                                            ? 'bg-blue-500 text-white self-end'
                                            : 'bg-gray-200 self-start'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    handleTyping();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
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
