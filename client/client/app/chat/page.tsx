'use client';

import { useEffect, useRef, useState } from 'react';
import { authFetch } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import socket, { connectSocket } from '@/lib/socket';

interface User {
    _id: string;
    name: string;
    avatar?: string;
}

interface Message {
    _id?: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt?: string;
    isRead?: boolean;
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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [typing, setTyping] = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
    const [unread, setUnread] = useState<Record<string, number>>({});
    const [lastMessages, setLastMessages] = useState<Record<string, Message | null>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageSound = useRef<HTMLAudioElement | null>(null);
    const [chatOpenedAt, setChatOpenedAt] = useState<number>(Date.now());

    useEffect(() => {
        messageSound.current = new Audio('/sounds/message.mp3');
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const id = getUserIdFromToken();
            if (id) {
                setCurrentUserId(id);
                connectSocket();
                

                const data = await authFetch('http://localhost:5000/api/user/me');
                setCurrentUser(data);
            }
        };
        fetchCurrentUser();

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (otherUserId) {
            setChatOpenedAt(Date.now());
        }
    }, [otherUserId]);

    useEffect(() => {
        socket.on('onlineUsers', (ids: string[]) => {
            setOnlineUserIds(ids);
        });

        socket.on('typing', (fromUserId: string) => {
            if (fromUserId === otherUserId) setTyping(true);
        });

        socket.on('stopTyping', (fromUserId: string) => {
            if (fromUserId === otherUserId) setTyping(false);
        });

        socket.on('newMessage', async (msg: Message) => {
            const isInCurrentChat = msg.sender === otherUserId;
            const isAfterChatOpened = msg.createdAt && new Date(msg.createdAt).getTime() > chatOpenedAt;

            if (isInCurrentChat) {
                setMessages((prev) => [...prev, msg]);
                setLastMessages((prev) => ({ ...prev, [otherUserId!]: msg }));

                if (isAfterChatOpened && currentUserId) {

                    socket.emit('readMessages', {
                        readerId: currentUserId,
                        senderId: msg.sender,
                    });
                }
            } else {
                setUnread((prev) => ({
                    ...prev,
                    [msg.sender]: (prev[msg.sender] || 0) + 1,
                }));
                setLastMessages((prev) => ({ ...prev, [msg.sender]: msg }));
            }

            messageSound.current?.play();
        });

        socket.on('readMessages', ({ readerId }) => {
            // ✅ Označ len poslednú správu ako prečítanú
            setMessages((prev) => {
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                    const msg = updated[i];
                    if (msg.receiver === readerId) {
                        updated[i] = { ...msg, isRead: true };
                        break;
                    }
                }
                return updated;
            });

            setLastMessages((prev) => {
                const last = prev[readerId];
                if (last && last.receiver === readerId) {
                    return {
                        ...prev,
                        [readerId]: { ...last, isRead: true },
                    };
                }
                return prev;
            });
        });

        return () => {
            socket.off('onlineUsers');
            socket.off('typing');
            socket.off('stopTyping');
            socket.off('newMessage');
            socket.off('readMessages');
        };
    }, [otherUserId]);

    useEffect(() => {
        authFetch('http://localhost:5000/api/match').then(async (matchedUsers: User[]) => {
            setUsers(matchedUsers);

            const messagesMap: Record<string, Message | null> = {};
            await Promise.all(
                matchedUsers.map(async (user) => {
                    const msgs = await authFetch(`http://localhost:5000/api/messages/${user._id}`);
                    messagesMap[user._id] = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                })
            );
            setLastMessages(messagesMap);

            const found = matchedUsers.find((u) => u._id === otherUserId);
            if (found) setOtherUser(found);
        });
    }, [otherUserId]);

    useEffect(() => {
        if (!otherUserId) return;

        const fetchMessages = async () => {
            const res = await authFetch(`http://localhost:5000/api/messages/${otherUserId}`);
            setMessages(res);
        };

        fetchMessages();
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
                        className={`cursor-pointer p-2 rounded hover:bg-blue-100 flex justify-between items-start ${
                            user._id === otherUserId ? 'bg-blue-200' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3 max-w-[180px]">
                            <img
                                src={user.avatar || '/avatar1.png'}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                  <span className="font-medium flex items-center gap-2">
                                    {user.name}
                                      {onlineUserIds.includes(user._id) && (
                                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                                      )}
                                  </span>
                                <span className="text-xs text-gray-500 truncate">
                                    {lastMessages[user._id]?.content ?? ''}
                                </span>
                            </div>
                        </div>

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
                            {messages.map((msg, index) => {
                                const isOwn = msg.sender === currentUserId;
                                return (
                                    <div key={index} className={`mb-2 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        {!isOwn && (
                                            <img
                                                src={otherUser?.avatar || '/avatar1.png'}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                                            />
                                        )}
                                        <div
                                            className={`p-2 rounded max-w-[80%] text-sm ${
                                                isOwn ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'
                                            }`}
                                        >
                                            <div>{msg.content}</div>
                                            {msg.createdAt && (
                                                <div className="text-xs text-gray-400 mt-1 text-right">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            )}
                                            {msg.sender === currentUserId &&
                                                messages[messages.length - 1]?._id === msg._id &&
                                                msg.isRead && (
                                                    <span className="ml-2 text-blue-300">✓✓</span>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
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
