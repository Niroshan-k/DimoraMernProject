import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListingItem from '../components/ListingItem';

export default function LikedListings() {
    const { currentUser } = useSelector((state) => state.user); // Get the logged-in user
    const [likedListings, setLikedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedListings = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/UserLiked/${currentUser._id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch liked listings');
                }
                const data = await res.json();
                setLikedListings(data.listings); // Set the liked listings
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser._id) {
            fetchLikedListings();
        }
    }, [currentUser]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (likedListings.length === 0) {
        return <p className="text-gray-500">You haven't liked any listings yet.</p>;
    }

    return (
        <div className="p-5">d
            <h6 className="text-5xl mb-5 mt-20">Favorites</h6>
            <div className="grid grid-cols-1 md:grid-cols-4  gap-5">
                {likedListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    );
}