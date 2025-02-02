'use client';
import { useRouter } from 'next/navigation';

export default function PlayBoard() {
    const router = useRouter();

    const handleGuessByPicture = () => {
        router.push('playboard/guess-by-picture');
    };

    const handleGuessByDescription = () => {
        router.push('playboard/guess-by-description');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">Choose Your Game Mode</h1>
                <div className="space-y-6">
                    <div>
                        <button
                            onClick={handleGuessByPicture}
                            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Guess By Picture
                        </button>
                        <p className="mt-2 text-gray-600">Guess a random character from an image. You will have a few tries!</p>
                    </div>
                    <div>
                        <button
                            onClick={handleGuessByDescription}
                            className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 transition-colors"
                        >
                            Guess By Description
                        </button>
                        <p className="mt-2 text-gray-600">Guess a random character based on their description. Test your knowledge!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}