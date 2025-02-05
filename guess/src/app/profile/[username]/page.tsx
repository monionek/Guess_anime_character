"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPoints, deleteUser } from "@/store/pointsSlice";
import { RootState, AppDispatch } from "@/store/store";

const ProfilePage = () => {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.points.user);
    const loading = useSelector((state: RootState) => state.points.loading);
    const error = useSelector((state: RootState) => state.points.error);
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/login");
            return;
        }

        if (params.username) {
            dispatch(fetchUserPoints(params.username as string));
        }
    }, [params.username, dispatch, router]);


    const handleDelete = async () => {
        if (!user) return;

        const success = await dispatch(deleteUser(user.userName));
        if (success) {
            localStorage.removeItem("jwtToken");
            router.push("/");
            alert("Account has been deleted");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );

    if (error || !user)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <p className="text-red-300 text-lg">User not found</p>
            </div>
        );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white/90 shadow-2xl rounded-xl p-8 w-96 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome, {user.userName} 👋
                </h1>
                <div className="space-y-3 text-gray-700">
                    <p className="text-lg">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Points:</span> {user.points} 🎯
                    </p>
                    <p>
                        <button
                            onClick={handleDelete}
                            className="mt-4 px-6 py-2 text-white font-semibold bg-red-500 hover:bg-red-600 active:opacity-75 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            Delete Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;