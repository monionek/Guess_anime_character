'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [userNameValue, setUserNameValue] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const router = useRouter();

    const logIn = async (userName: string, password: string) => {
        try {
            const loginData = {
                userName: userName,
                password: password,
            };
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
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
        try {
            e.preventDefault();
            const token = await logIn(userNameValue, passwordValue);
            if (token) {
                localStorage.setItem('jwtToken', token.token);
                setLoginStatus({
                    success: true,
                    message: 'Login successful!',
                });
                router.push('/'); // Redirect to dashboard
            }
        } catch (error) {
            setLoginStatus({
                success: false,
                message: error instanceof Error ? error.message : 'Login failed. Please try again.',
            });
        }
    };

    return (
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h1>

                {/* Login Status Prompt */}
                {loginStatus && (
                    <div
                        className={`p-4 mb-6 rounded-md ${loginStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {loginStatus.message}
                    </div>
                )}

                <form id="register-form" className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userNameValue}
                            onChange={(e) => setUserNameValue(e.target.value)}
                            placeholder="Enter your username"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}