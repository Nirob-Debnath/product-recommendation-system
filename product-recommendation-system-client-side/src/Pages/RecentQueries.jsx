import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaThumbsUp } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const RecentQueries = () => {
    const [queries, setQueries] = useState([]);
    const [user, setUser] = useState(null);
    const [likesData, setLikesData] = useState({});
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const fetchQueries = async () => {
            try {
                const res = await fetch('https://productrecommendationsystem.vercel.app/addquery');
                const data = await res.json();
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setQueries(sorted);
            } catch (err) {
                console.error('Failed to fetch queries:', err);
            }
        };

        fetchQueries();
        return () => unsubscribe();
    }, []);

    const handleLike = async (id) => {
        if (!user) return alert('Please login to like');
        const res = await fetch(`https://productrecommendationsystem.vercel.app/addquery/${id}/like`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid })
        });
        const data = await res.json();
        if (data.success) {
            const updated = await fetch(`https://productrecommendationsystem.vercel.app/addquery`);
            const updatedQuery = await updated.json();
            const updatedItem = updatedQuery.find(q => q._id === id);
            if (updatedItem) {
                setLikesData((prev) => ({ ...prev, [id]: updatedItem.likes }));
            }
        }
    };

    const displayQueries = showAll ? queries : queries.slice(0, 12);

    if (!Array.isArray(queries)) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {displayQueries.length === 0 ? (
                    <p className="text-center col-span-full">No queries found.</p>
                ) : (
                    displayQueries.map((query) => {
                        const {
                            _id,
                            productname,
                            productbrand,
                            productimageurl,
                            alternativeproduct,
                            likes = [],
                        } = query;
                        const liked = (likesData[_id] || likes).includes(user?.uid);
                        return (
                            <div key={_id} className="card bg-base-100 w-full max-w-[200px] min-h-[320px] shadow-sm mx-auto flex flex-col">
                                <figure>
                                    <img
                                        src={productimageurl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={productname || 'Product'}
                                        className="h-48 w-full object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{productname}</h2>
                                    <p>Brand: {productbrand}</p>
                                    <p>Alternative: {alternativeproduct}</p>
                                    <div className="flex justify-center gap-1 mt-2">
                                        <button
                                            onClick={() => handleLike(_id)}
                                            className={`btn ${liked ? 'btn-success' : 'btn-outline'}`}
                                        >
                                            <FaThumbsUp className="mr-2" /> {(likesData[_id]?.length || likes.length)}
                                        </button>
                                        <Link to={`/viewdetails/${_id}`} className="btn btn-info">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {/* See More button if there are more than 12 queries and not showing all */}
            {!showAll && queries.length > 12 && (
                <div className="flex justify-center mt-6">
                    <button className="button-filled px-6 py-2" onClick={() => setShowAll(true)}>
                        See More
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentQueries;