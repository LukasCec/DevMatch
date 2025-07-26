'use client';

import { User } from '@/types/user';
import { FC } from 'react';

interface Props {
    user: User;
    onLike?: () => void;
    showLike?: boolean;
}

const UserCard: FC<Props> = ({ user, onLike, showLike = false }) => {
    return (
        <div className="bg-white shadow rounded-xl p-5 mb-4 border">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-700">{user.name}</h2>
                {showLike && (
                    <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        onClick={onLike}
                    >
                        ❤️ Like
                    </button>
                )}
            </div>

            <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Technológie:</strong> {user.techStack?.join(', ') || '–'}</p>
                <p><strong>Úroveň:</strong> {user.level || '–'}</p>
                <p><strong>Cieľ:</strong> {user.goal || '–'}</p>
                <p><strong>Dostupnosť:</strong> {user.availability || '–'}</p>
            </div>
        </div>
    );
};

export default UserCard;
