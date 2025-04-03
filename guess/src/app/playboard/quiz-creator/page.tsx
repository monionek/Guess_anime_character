'use client'

import { useState, useEffect } from 'react';
import { quizData } from '@/utils/interfaces';
import { useJwt } from '@/utils/jwt-context';

export default function QuizCreatorPage() {
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [correctAnswer, setCorrectAnswer] = useState<string>('');
    const [wrongAnswers, setWrongAnswers] = useState<string[]>(['', '', '']);
    const [description, setDescription] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const { jwtToken } = useJwt();

    useEffect(() => {
        setLoggedIn(jwtToken !== null);
    }, [jwtToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!correctAnswer || wrongAnswers.some(answer => !answer) || !description) {
            setMessage('Please fill out all fields.');
            return;
        }

        const quiz: quizData = {
            quizTitle,
            correctAnswer,
            wrongAnswers,
            description,
        };

        try {
            const response = await fetch('/api/save-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quiz),
            });

            if (response.ok) {
                setMessage('✅ Quiz saved successfully!');
                setQuizTitle('');
                setCorrectAnswer('');
                setWrongAnswers(['', '', '']);
                setDescription('');
            } else {
                setMessage('❌ Failed to save the quiz.');
            }
        } catch (error) {
            console.error('Error saving quiz:', error);
            setMessage('⚠️ An error occurred while saving the quiz.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            {loggedIn ? (<div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📜 Quiz Creator</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Quiz Title */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">🧠 Quiz Title:</label>
                        <input
                            type="text"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    {/* Correct Answer */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">✅ Correct Answer:</label>
                        <input
                            type="text"
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Wrong Answers */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">❌ Wrong Answers:</label>
                        {wrongAnswers.map((answer, index) => (
                            <input
                                key={index}
                                type="text"
                                value={answer}
                                onChange={(e) => {
                                    const newWrongAnswers = [...wrongAnswers];
                                    newWrongAnswers[index] = e.target.value;
                                    setWrongAnswers(newWrongAnswers);
                                }}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                                required
                            />
                        ))}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">📖Character Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-28"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:opacity-80"
                    >
                        🚀 Save Quiz
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-center text-lg font-medium">
                        {message}
                    </p>
                )}
            </div>) : (<div className="flex items-center justify-center min-h-screen">
                <p className="text-2xl text-red-500 font-semibold">Please log in to use quiz creator</p>
            </div>)}
        </div>
    );
}