import { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
export const metadata: Metadata = {
  title: "guess anime character",
  description: "Guess anime character game"
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav id="nav-bar" className="flex flex-row gap-4 p-4 bg-gray-800 text-white">
          <Link href="/">Home</Link>
          <Link href="/registration">Register</Link>
          <Link href="/login">Login</Link>
          <Link href="/leaderboard">Ranking</Link>
          <Link href="/shop">Shop</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
