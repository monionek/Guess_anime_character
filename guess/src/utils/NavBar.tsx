"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/utils/theme-context";
import { useJwt } from "@/utils/jwt-context";

export default function NavBar() {
    const { theme, toggleTheme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const { jwtToken, setJwtToken } = useJwt();

    useEffect(() => {
        if (jwtToken === null) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, [jwtToken]);

    const navBarStyles = theme === "light" ? "bg-white text-black" : "bg-black text-white";

    return (
        <nav id="nav-bar" className={`flex flex-row gap-4 p-4 ${navBarStyles}`}>
            <Link href="/">Home</Link>
            <Link href="/leaderboard">Ranking</Link>
            <Link href="/shop">Shop</Link>
            {isAuthenticated ? (
                <>
                    <button
                        onClick={() => {
                            setJwtToken(null)
                            localStorage.removeItem("jwtToken");
                            setIsAuthenticated(false);
                        }}
                    >
                        Log Out
                    </button>
                </>
            ) : (
                <>
                    <Link href="/registration">Register</Link>
                    <Link href="/login">Login</Link>
                </>
            )}
            <Link href="/playboard">PLAY</Link>
            <Link href="/profile">Profile</Link>
            <button onClick={toggleTheme}>
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
        </nav>
    );
}