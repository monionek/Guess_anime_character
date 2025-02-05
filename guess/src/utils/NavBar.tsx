"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/utils/theme-context";

export default function NavBar() {
    const { theme, toggleTheme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken");
        setIsAuthenticated(!!jwtToken);
    }, []);

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