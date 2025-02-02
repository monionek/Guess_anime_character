'use client'
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    setIsAuthenticated(!!jwtToken)
  })
  return (
    <html lang="en">
      <body>
        <nav id="nav-bar" className="flex flex-row gap-4 p-4 bg-gray-800 text-white">
          <Link href="/">Home</Link>
          <Link href="/leaderboard">Ranking</Link>
          <Link href="/shop">Shop</Link>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  localStorage.removeItem('jwtToken');
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
        </nav>
        {children}
      </body>
    </html>
  );
}
