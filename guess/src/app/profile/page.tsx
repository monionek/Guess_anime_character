'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProfileRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log("no Token")
            router.push('/login');
            return;
        }
        const userName = localStorage.getItem('userName');
        if (userName) {
            router.push(`/profile/${userName}`);
        } else {
            router.push('/login');
        }
    }, [router]);

    return <p>Redirecting...</p>;
};

export default ProfileRedirect;