'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { userData } from '@/utils/interfaces';

const ProfilePage = () => {
    const router = useRouter();
    const params = useParams();
    const [user, setUser] = useState<userData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUser = async () => {
            if (!params.username) return;
            try {
                const response = await fetch('/api/get-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userName: params.username }),
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.username, router]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );

    if (!user)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <p className="text-red-300 text-lg">User not found</p>
            </div>
        );
    const handleDelete = async () => {
        try {
            const deleted = await fetch('/api/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: params.username })
            })
            if (!deleted.ok) {
                console.log(deleted)
                return
            }
            localStorage.removeItem("jwtToken")
            router.push("/")
            alert('account has been deleted')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white/90 shadow-2xl rounded-xl p-8 w-96 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome, {user.userName} 👋
                </h1>
                <div className="space-y-3 text-gray-700">
                    <p className="text-lg">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Points:</span> {user.points} 🎯
                    </p>
                    <p>
                        <button
                            onClick={handleDelete}
                            className="mt-4 px-6 py-2 text-white font-semibold bg-red-500 hover:bg-red-600 active:opacity-75 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            Delete Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;