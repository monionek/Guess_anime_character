'use client';
import { useEffect, useState } from 'react';

export default function LeaderBoardPage() {
    const [leaderboardData, setLeaderboardData] = useState<
        Array<{
            userName: string;
            numberOfTries: number;
            characterName: string;
        }>
    >([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch('/api/get-leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await response.json();

                if (Array.isArray(data)) {
                    setLeaderboardData(data);
                } else {
                    console.error('Expected an array but got:', data);
                    setLeaderboardData([]);
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
                setLeaderboardData([]);
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <h1 className="text-3xl font-bold text-center mt-8 mb-8 text-gray-800">Leaderboard</h1>
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Number of Tries
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Character Name
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {leaderboardData.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {entry.userName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {entry.numberOfTries}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {entry.characterName}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leaderboardData.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No leaderboard data available.</p>
                )}
            </div>
        </div>
    );
}