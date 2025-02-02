'use client'; // Ensure this is a Client Component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirecting

export default function GuessByPicturePage() {
    const [character, setCharacter] = useState<{
        name: string;
        image_url: string;
        about: string;
        animeTitle: string;
    } | null>(null);
    const [userGuess, setUserGuess] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [numberOfTries, setNumberOfTries] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const [showAnimeTitle, setShowAnimeTitle] = useState(false);
    const router = useRouter();

    // Fetch character data from API
    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch('/api/random-character'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch character');
                }
                const data = await response.json();
                setCharacter(data);
                setUserGuess('');
                setIsCorrect(null);
                setNumberOfTries(0);
                setShowImage(false);
                setShowAnimeTitle(false);
            } catch (error) {
                console.error('Error fetching character:', error);
            }
        };

        fetchCharacter();
    }, []);

    // Handle user's guess
    const handleGuess = async () => {
        if (!character) return;

        setNumberOfTries((prev) => {
            const newTries = prev + 1;

            if (newTries >= 5) {
                setShowImage(true); // Show image after 5 incorrect tries
            }
            if (newTries >= 10) {
                setShowAnimeTitle(true); // Show anime title after 10 incorrect tries
            }

            return newTries;
        });

        if (userGuess.trim().toLowerCase() === character.name.toLowerCase()) {
            setIsCorrect(true);

            // Get username from JWT stored in localStorage
            const jwtToken = localStorage.getItem('jwtToken');
            let userName = 'Guest';

            if (jwtToken) {
                try {
                    const payload = JSON.parse(atob(jwtToken.split('.')[1])); // Decode JWT payload
                    userName = payload.username || 'Guest';
                } catch (error) {
                    console.error('Error decoding JWT:', error);
                }
            }

            // Send data to leaderboard API
            try {
                const leaderboardResponse = await fetch('/api/set-leaderboard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName,
                        numberOfTries,
                        characterName: character.name,
                    }),
                });

                if (!leaderboardResponse.ok) {
                    throw new Error('Failed to update leaderboard');
                }

                console.log('Leaderboard updated successfully');
            } catch (error) {
                console.error('Error updating leaderboard:', error);
            }

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/playboard');
            }, 2000);
        } else {
            setIsCorrect(false);
        }
    };

    if (!character) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h1 className="text-2xl font-bold mb-4 text-white">Guess the Character</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                {/* Description as a Hint */}
                <p className="text-gray-600 mb-4">{character.about}</p>

                {/* Image Hint (Appears after 5 incorrect tries) */}
                {showImage && (
                    <img
                        src={character.image_url}
                        alt="Character"
                        className="w-full h-64 object-cover rounded-md mb-4"
                    />
                )}

                {/* Input for User's Guess */}
                <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Who is this character?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Submit Button */}
                <button
                    onClick={handleGuess}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Submit Guess
                </button>

                {/* Feedback */}
                {isCorrect !== null && (
                    <p className={`mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? 'Correct! 🎉 Redirecting to playboard...' : 'Incorrect. Try again! ❌'}
                    </p>
                )}

                {/* Display number of tries */}
                <p className="text-gray-500 mt-4">Number of tries: {numberOfTries}</p>

                {/* Anime Title Hint (Appears after 10 incorrect tries) */}
                {showAnimeTitle && (
                    <p className="text-blue-600 font-bold mt-4">
                        Hint: This character is from <span className="italic">{character.animeTitle}</span>.
                    </p>
                )}
            </div>
        </div>
    );
}
