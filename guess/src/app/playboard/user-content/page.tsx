'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizData } from '@/utils/interfaces';

export default function UserContentPage() {
    const [quizzes, setQuizzes] = useState<quizData[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('/api/get-quizzes');
                if (response.ok) {
                    const data = await response.json();
                    setQuizzes(data);
                } else {
                    console.error('Failed to fetch quizzes');
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const processQuizTitle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleQuizClick = (quizTitle: string) => {
        const slug = encodeURIComponent(quizTitle);
        router.push(`/playboard/user-content/${slug}`);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📝 Quiz List</h1>

                {quizzes.length > 0 ? (
                    <ul className="space-y-3">
                        {quizzes.map((quiz, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleQuizClick(quiz.quizTitle)}
                                    className="w-full text-left bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-200 hover:scale-105"
                                >
                                    {quiz.quizTitle}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center">❌ No quizzes found.</p>
                )}
            </div>
        </div>
    );
}
