'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizData } from '@/utils/interfaces';

export default function QuizPage() {
    const { quizTitle } = useParams();
    const decodedTitle = decodeURIComponent(quizTitle as string); // Dekodowanie tytułu
    const router = useRouter();

    const [quiz, setQuiz] = useState<quizData | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`/api/get-quiz?title=${encodeURIComponent(decodedTitle)}`);
                if (response.ok) {
                    const data = await response.json();
                    setQuiz(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            }
        };

        fetchQuiz();
    }, [decodedTitle]);

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
        const correct = answer === quiz?.correctAnswer;
        setIsCorrect(correct);

        // Przekierowanie po 2 sekundach
        setTimeout(() => {
            router.push('/playboard/user-content');
        }, 2000);
    };

    if (error) {
        return <div className="text-center text-red-600">❌ Nie znaleziono quizu!</div>;
    }

    if (!quiz) {
        return <div className="text-center">⏳ Ładowanie...</div>;
    }

    // Losowe przetasowanie odpowiedzi
    const shuffledAnswers = [quiz.correctAnswer, ...quiz.wrongAnswers].sort(() => Math.random() - 0.5);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 p-6">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{quiz.quizTitle}</h1>
                <p className="text-gray-700 mb-4">{quiz.description}</p>

                <div className="space-y-3">
                    {shuffledAnswers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerClick(answer)}
                            className={`w-full text-left font-semibold px-4 py-2 rounded-lg shadow-md transition-all ${selectedAnswer
                                ? answer === quiz.correctAnswer
                                    ? 'bg-green-500 text-white' // Poprawna odpowiedź
                                    : answer === selectedAnswer
                                        ? 'bg-red-500 text-white' // Niepoprawna odpowiedź
                                        : 'bg-gray-200 text-gray-700' // Pozostałe odpowiedzi
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200' // Niekliknięte odpowiedzi
                                }`}
                            disabled={selectedAnswer !== null} // Zablokuj przyciski po wybraniu odpowiedzi
                        >
                            {answer}
                        </button>
                    ))}
                </div>

                {selectedAnswer && (
                    <p className={`mt-4 text-center text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '🎉 Poprawna odpowiedź!' : '❌ Niepoprawna odpowiedź!'}
                    </p>
                )}
            </div>
        </div>
    );
}