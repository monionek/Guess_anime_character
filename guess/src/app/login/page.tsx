'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/utils/firebase';

export default function LoginPage() {
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [userNameValue, setUserNameValue] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<{ success: boolean; message: string; } | null>(null);
    const router = useRouter();

    const logIn = async (userName: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to log in');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = await logIn(userNameValue, passwordValue);
            if (token) {
                localStorage.setItem('jwtToken', token.token);
                localStorage.setItem('userName', userNameValue)
                setLoginStatus({ success: true, message: 'Login successful!' });
                router.push('/');
            }
        } catch (error) {
            setLoginStatus({ success: false, message: error instanceof Error ? error.message : 'Login failed. Please try again.' });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            if (result) {
                localStorage.setItem('jwtToken', result.token);
                setLoginStatus({ success: true, message: 'Logged in with Google!' });
                router.push('/');
            }
        } catch (error) {
            setLoginStatus({ success: false, message: 'Google login failed. Try again.' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h1>

                {loginStatus && (
                    <div className={`p-4 mb-6 rounded-md ${loginStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {loginStatus.message}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" id="username" value={userNameValue} onChange={(e) => setUserNameValue(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <button type="submit" className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Log In
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <button onClick={handleGoogleLogin} className="w-full py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700">
                        Log In with Google
                    </button>
                </div>
            </div>
        </div>
    );
}