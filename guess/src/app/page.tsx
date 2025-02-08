'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJwt } from '@/utils/jwt-context';

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const { jwtToken } = useJwt();

  useEffect(() => {
    setLoggedIn(jwtToken !== null);
  }, [jwtToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-center">
      {loggedIn ? (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">🎮 Welcome to Guessing Game! 🎮</h1>
          <p className="text-lg text-gray-700 mb-4">Less go playing</p>
          <button
            onClick={() => router.push('/playboard')}
            className="px-6 py-3 bg-purple-600 text-white text-lg rounded-lg shadow-lg hover:bg-purple-700 transition-all"
          >
            Play now
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">🎮 Welcome to Guessing Game! 🎮</h1>
          <p className="text-lg text-gray-700 mb-4">To start playing, please create an account.</p>
          <button
            onClick={() => router.push('/registration')}
            className="px-6 py-3 bg-purple-600 text-white text-lg rounded-lg shadow-lg hover:bg-purple-700 transition-all"
          >
            Register Now
          </button>
        </>
      )}
    </div>
  );
}
