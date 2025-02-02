'use client';
import { useState } from 'react';
import { userData } from '@/utils/interfaces';

export default function RegisterPage() {
    const [emailValue, setEmailValue] = useState<string>('');
    const [nameValue, setNameValue] = useState<string>('');
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [registrationStatus, setRegistrationStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const registerUser = async (userData: userData) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register user');
            }

            return data.user;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = {
            userName: nameValue,
            email: emailValue,
            password: passwordValue,
        };

        try {
            const registered = await registerUser(user);
            if (registered) {
                setEmailValue('');
                setNameValue('');
                setPasswordValue('');

                setRegistrationStatus({
                    success: true,
                    message: 'Registration successful!',
                });
            }
        } catch (error) {
            setRegistrationStatus({
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
            });
        }
    };

    return (
        <div id="register-page" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register your account</h1>

                {/* Registration Status Prompt */}
                {registrationStatus && (
                    <div
                        className={`p-4 mb-6 rounded-md ${registrationStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {registrationStatus.message}
                    </div>
                )}

                <form id="register-form" className="space-y-6" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
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
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}