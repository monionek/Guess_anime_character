export interface userData {
    userName: string;
    email: string;
    password: string;
    points: number;
}

export interface leaderboardData {
    userName: string;
    numberOfTries: number;
    characterName: string;
}

export interface quizData {
    quizTitle: string;
    correctAnswer: string;
    wrongAnswers: string[];
    description: string;
}

export interface Character {
    name: string;
    image_url: string;
    about: string;
    animeTitle: string;
}

export interface GameState {
    userGuess: string;
    isCorrect: boolean | null;
    numberOfTries: number;
    showHint: boolean;
    showExtraHint: boolean;
}

export type GameAction =
    | { type: "SET_USER_GUESS"; payload: string }
    | { type: "SET_IS_CORRECT"; payload: boolean | null }
    | { type: "INCREMENT_NUMBER_OF_TRIES" }
    | { type: "RESET_GAME_STATE" }
    | { type: "SET_SHOW_HINT"; payload: boolean }
    | { type: "SET_SHOW_EXTRA_HINT"; payload: boolean };