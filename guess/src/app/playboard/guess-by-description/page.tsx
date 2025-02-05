'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { updateUserPoints } from "@/store/pointsSlice";
import { AppDispatch, RootState } from "@/store/store";


export default function GuessByDescriptionPage() {
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
    const isSubmittingRef = useRef(false);
    const router = useRouter();

    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.points);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch('/api/random-character');
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

    const getUserNameFromJWT = () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) return 'Guest';

        try {
            const userName = localStorage.getItem('userName');
            return userName || 'Guest';
        } catch (error) {
            console.error('Invalid JWT format:', error);
            return 'Guest';
        }
    };

    const updateLeaderboard = async (userName: string, tries: number, characterName: string) => {
        try {
            const leaderboardResponse = await fetch('/api/set-leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName,
                    numberOfTries: tries,
                    characterName,
                }),
            });

            if (!leaderboardResponse.ok) {
                throw new Error('Failed to update leaderboard');
            }

            console.log('Leaderboard updated successfully');
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    };

    const handleGuess = useCallback(async () => {
        console.log("handleGuess called");
        if (!character || isSubmittingRef.current) return;

        isSubmittingRef.current = true;

        setNumberOfTries((prev) => {
            const updatedTries = prev + 1;
            console.log(`Number of tries: ${updatedTries}`);

            if (updatedTries >= 5) setShowImage(true);
            if (updatedTries >= 10) setShowAnimeTitle(true);

            if (userGuess.trim().toLowerCase() === character.name.toLowerCase()) {
                console.log("Correct guess!");
                setIsCorrect(true);

                const userName = getUserNameFromJWT();
                console.log(`Updating leaderboard for user: ${userName}`);
                updateLeaderboard(userName, updatedTries, character.name);

                if (userName !== 'Guest') {
                    console.log(`Updating points for user: ${userName}`);
                    const pointsToAdd = 100;
                    dispatch(updateUserPoints({ userName, newPoints: (user?.points || 0) + pointsToAdd }));
                }

                setTimeout(() => {
                    router.push('/playboard');
                }, 2000);
            } else {
                console.log("Incorrect guess.");
                setIsCorrect(false);
            }

            isSubmittingRef.current = false;
            return updatedTries;
        });
    }, [userGuess, character]);
    if (!character) {
        return <div>Loading...</div>;
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
                    onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
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

                {/* Display user's points */}
                {user && (
                    <p className="text-gray-500 mt-4">
                        Your points: <span className="font-bold">{user.points}</span>
                    </p>
                )}

                {/* Display loading or error messages */}
                {loading && <p className="text-gray-500 mt-4">Updating points...</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}