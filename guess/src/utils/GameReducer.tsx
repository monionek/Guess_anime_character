import { GameState, GameAction } from "./interfaces";
export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case "SET_USER_GUESS":
            return { ...state, userGuess: action.payload };
        case "SET_IS_CORRECT":
            return { ...state, isCorrect: action.payload };
        case "INCREMENT_NUMBER_OF_TRIES":
            return { ...state, numberOfTries: state.numberOfTries + 1 };
        case "RESET_GAME_STATE":
            return {
                userGuess: "",
                isCorrect: null,
                numberOfTries: 0,
                showHint: false,
                showExtraHint: false,
            };
        case "SET_SHOW_HINT":
            return { ...state, showHint: action.payload };
        case "SET_SHOW_EXTRA_HINT":
            return { ...state, showExtraHint: action.payload };
        default:
            return state;
    }
};