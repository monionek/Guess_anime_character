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