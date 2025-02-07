"use client";

import { useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { updateUserPoints, fetchUserPoints } from "@/store/pointsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Character, GameState } from '@/utils/interfaces';
import { gameReducer } from '@/utils/GameReducer';

const initialState: GameState = {
    userGuess: "",
    isCorrect: null,
    numberOfTries: 0,
    showHint: false,
    showExtraHint: false,
};

export default function GuessByPicturePage() {
    const [state, dispatchGame] = useReducer(gameReducer, initialState);
    const { userGuess, isCorrect, numberOfTries, showHint, showExtraHint } = state;

    const [character, setCharacter] = useState<Character | null>(null);
    const router = useRouter();

    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.points);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch("/api/random-character");
                if (!response.ok) {
                    throw new Error("Failed to fetch character");
                }
                const data = await response.json();
                setCharacter(data);
                dispatchGame({ type: "RESET_GAME_STATE" }); // Resetowanie stanu gry
            } catch (error) {
                console.error("Error fetching character:", error);
            }
        };

        fetchCharacter();
    }, []);


    const handleGuess = async () => {
        if (!character) return;

        dispatchGame({ type: "INCREMENT_NUMBER_OF_TRIES" }); // Zwiększ liczbę prób

        if (numberOfTries + 1 >= 5) dispatchGame({ type: "SET_SHOW_HINT", payload: true }); // Pokaż podpowiedź po 5 próbach
        if (numberOfTries + 1 >= 10) dispatchGame({ type: "SET_SHOW_EXTRA_HINT", payload: true }); // Pokaż dodatkową podpowiedź po 10 próbach

        if (userGuess.trim().toLowerCase() === character.name.toLowerCase()) {
            dispatchGame({ type: "SET_IS_CORRECT", payload: true }); // Ustaw poprawną odpowiedź

            const jwtToken = localStorage.getItem("jwtToken");
            let userName = "Guest";

            if (jwtToken) {
                try {
                    userName = localStorage.getItem("userName") || "Guest";
                } catch (error) {
                    console.error("Error decoding JWT:", error);
                }
            }

            try {
                const leaderboardResponse = await fetch("/api/set-leaderboard", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName,
                        numberOfTries: numberOfTries + 1,
                        characterName: character.name,
                    }),
                });

                if (!leaderboardResponse.ok) {
                    throw new Error("Failed to update leaderboard");
                }

                console.log("Leaderboard updated successfully");
            } catch (error) {
                console.error("Error updating leaderboard:", error);
            }

            if (user && userName !== "Guest") {
                const pointsToAdd = 100;
                await dispatch(updateUserPoints({ userName, newPoints: user.points + pointsToAdd }));
                await dispatch(fetchUserPoints(userName));
            }

            setTimeout(() => {
                router.push("/playboard");
            }, 2000);
        } else {
            dispatchGame({ type: "SET_IS_CORRECT", payload: false }); // Ustaw niepoprawną odpowiedź
        }
    };

    if (!character) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h1 className="text-2xl font-bold mb-4 text-white">Guess the Character by Picture</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                <img
                    src={character.image_url}
                    alt="Character"
                    className="w-full h-64 object-cover rounded-md mb-4"
                />

                {showHint && (
                    <p className="text-gray-700 mb-4">Hint: This character is from {character.animeTitle}</p>
                )}
                {showExtraHint && (
                    <p className="text-gray-700 mb-4">Extra Hint: {character.about}</p>
                )}

                <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => dispatchGame({ type: "SET_USER_GUESS", payload: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                    placeholder="Who is this character?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleGuess}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Submit Guess
                </button>

                {isCorrect !== null && (
                    <p className={`mt-4 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "Correct! 🎉 Redirecting to playboard..." : "Incorrect. Try again! ❌"}
                    </p>
                )}

                <p className="text-gray-500 mt-4">Number of tries: {numberOfTries}</p>
            </div>
        </div>
    );
}