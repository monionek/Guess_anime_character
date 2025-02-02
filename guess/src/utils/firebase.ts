import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDb7_B_ks9YyVZzhmPRuj2Nz0LtGmeURPg",
    authDomain: "guess-anime-character-58281.firebaseapp.com",
    projectId: "guess-anime-character-58281",
    storageBucket: "guess-anime-character-58281.firebasestorage.app",
    messagingSenderId: "23901537914",
    appId: "1:23901537914:web:0a2ee293f457a68f0f1dc3",
    measurementId: "G-DTDJ003Z6F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<{ user: User; token: string } | null> => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const token = await user.getIdToken();

        return { user, token };
    } catch (error) {
        console.error("Błąd logowania przez Google:", error);
        return null;
    }
};

export const logOut = async (): Promise<void> => {
    try {
        await signOut(auth);
        localStorage.removeItem("jwtToken");
    } catch (error) {
        console.error("Błąd wylogowania:", error);
    }
};

export { auth };