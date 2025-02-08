'use client'
import { useEffect, useState } from "react";
import { useJwt } from "@/utils/jwt-context";
import { shopItem } from "@/utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPoints, fetchUserPoints } from "@/store/pointsSlice";
import { AppDispatch, RootState } from "@/store/store";

export default function ShopPage() {
    const { jwtToken } = useJwt();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [shopItems, setShopItems] = useState<shopItem[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.points);

    useEffect(() => {
        setLoggedIn(jwtToken !== null);
    }, [jwtToken]);

    useEffect(() => {
        const fetchShopItems = async () => {
            try {
                const response = await fetch("/api/get-items-from-shop");
                if (!response.ok) throw new Error("Failed to fetch shop items");
                const data = await response.json();
                setShopItems(data);
            } catch (error) {
                console.error("Error fetching shop items:", error);
            }
        };
        fetchShopItems();
    }, []);

    useEffect(() => {
        if (loggedIn) {
            const userName = localStorage.getItem('userName');
            if (userName) {
                dispatch(fetchUserPoints(userName));
            }
        }
    }, [loggedIn, dispatch]);

    const groupedItems = shopItems.reduce((acc, item) => {
        if (!acc[item.itemType]) acc[item.itemType] = [];
        acc[item.itemType].push(item);
        return acc;
    }, {} as Record<string, shopItem[]>);

    const handleBuy = async (item: shopItem) => {
        const userName = localStorage.getItem('userName');
        if (userName && user) {
            if (user.points >= item.price) {
                try {
                    const response = await fetch("/api/buy-item", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userName: userName, shopItem: item }),
                    })
                    if (!response.ok) {
                        alert("failed to buy item")
                        return
                    }
                    const newPoints = user.points - item.price;
                    await dispatch(updateUserPoints({ userName, newPoints }));
                    await dispatch(fetchUserPoints(userName));
                    alert(`You have successfully purchased ${item.name}!`);
                } catch (error) {
                    console.error("Error purchasing item:", error);
                    alert("Failed to purchase item. Please try again.");
                }
            } else {
                alert("You don't have enough points to buy this item.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            {loggedIn ? (
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-purple-900 mb-8">🤑 Welcome to the Shop 🤑</h1>
                    {user && (
                        <div className="text-center text-lg font-semibold text-purple-700 mb-6">
                            Your Points: {user.points}
                        </div>
                    )}
                    {Object.keys(groupedItems).map((category) => (
                        <div key={category} className="mb-8">
                            <h2 className="text-2xl font-semibold text-purple-800 mb-4">{category.toUpperCase()}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {groupedItems[category].map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
                                        <div className="p-6">
                                            <div className="text-5xl text-center mb-4">{item.emoji}</div>
                                            <h2 className="text-xl font-semibold text-gray-800 text-center">{item.name}</h2>
                                            <p className="text-gray-600 text-center mt-2">Price: {item.price} points</p>
                                            <button
                                                onClick={() => handleBuy(item)}
                                                className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                disabled={loading || (user ? user.points < item.price : true)}
                                            >
                                                {loading ? "Processing..." : "Buy"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-2xl text-red-500 font-semibold">Please log in to see the shop content</p>
                </div>
            )}
        </div>
    );
}