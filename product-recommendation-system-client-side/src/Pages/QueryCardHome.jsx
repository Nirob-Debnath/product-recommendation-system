import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaThumbsUp } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const QueryCardHome = () => {
    const [queries, setQueries] = useState([]);
    const [user, setUser] = useState(null);
    const [likesData, setLikesData] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [commentTexts, setCommentTexts] = useState({});
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState({});
    const [editTexts, setEditTexts] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleComment = async (id, commentText) => {
        if (!user || !commentText) return;
        setLoading(true);
        const res = await fetch(`https://productrecommendationsystem.vercel.app/addquery/${id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.uid,
                username: user.displayName || 'Anonymous',
                text: commentText,
            }),
        });
        const data = await res.json();
        if (data.success) {
            setCommentsData((prev) => ({
                ...prev,
                [id]: [...(prev[id] || []), data.comment],
            }));
            setCommentTexts((prev) => ({ ...prev, [id]: '' }));
        }
        setLoading(false);
    };

    const handleDeleteComment = async (queryId, commentId) => {
        const res = await fetch(`https://productrecommendationsystem.vercel.app/addquery/${queryId}/comment/${commentId}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
            setCommentsData((prev) => ({
                ...prev,
                [queryId]: (prev[queryId] || []).filter((c) => c._id !== commentId),
            }));
        }
    };

    const handleEditComment = async (queryId, commentId, text) => {
        const res = await fetch(`https://productrecommendationsystem.vercel.app/addquery/${queryId}/comment/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (data.success) {
            setCommentsData((prev) => ({
                ...prev,
                [queryId]: (prev[queryId] || []).map((c) =>
                    c._id === commentId ? { ...c, text } : c
                ),
            }));
            setEditMode((prev) => ({ ...prev, [commentId]: false }));
        }
    };

    const filteredQueries = queries.filter((query) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            (query.productname && query.productname.toLowerCase().includes(lowerSearch)) ||
            (query.productbrand && query.productbrand.toLowerCase().includes(lowerSearch)) ||
            (query.refinedproduct && query.refinedproduct.toLowerCase().includes(lowerSearch)) ||
            (query.boycottreason && query.boycottreason.toLowerCase().includes(lowerSearch)) ||
            (query.additionalnotes && query.additionalnotes.toLowerCase().includes(lowerSearch))
        );
    });

    if (!Array.isArray(queries)) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search by product name, brand, reason..."
                    className="input input-bordered w-full max-w-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQueries.length === 0 ? (
                    <p className="text-center col-span-full">No queries found.</p>
                ) : (
                    filteredQueries.map((query) => {
                        const {
                            _id,
                            productname,
                            productbrand,
                            productimageurl,
                            alternativeproduct,
                            boycottreason,
                            additionalnotes,
                            likes = [],
                            comments = [],
                        } = query;

                        const liked = (likesData[_id] || likes).includes(user?.uid);
                        const allComments = commentsData[_id] || comments;
                        const commentText = commentTexts[_id] || '';

                        return (
                            <div key={_id} className="card bg-base-100 w-96 shadow-sm">
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
                                    <p>Reason: {boycottreason}</p>
                                    <p>Notes: {additionalnotes}</p>

                                    <div className="flex gap-4 mt-2">
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

                                    <div className="mt-4">
                                        <h4 className="font-bold">Comments ({allComments.length})</h4>
                                        {allComments.map((c) => (
                                            <div key={c._id} className="bg-gray-100 p-2 my-1 rounded">
                                                <p className="text-sm font-medium">{c.username}</p>
                                                {editMode[c._id] ? (
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            className="input input-bordered input-sm w-full"
                                                            value={editTexts[c._id] || ''}
                                                            onChange={(e) =>
                                                                setEditTexts((prev) => ({
                                                                    ...prev,
                                                                    [c._id]: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                handleEditComment(_id, c._id, editTexts[c._id])
                                                            }
                                                            className="btn btn-sm btn-success"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setEditMode((prev) => ({
                                                                    ...prev,
                                                                    [c._id]: false,
                                                                }))
                                                            }
                                                            className="btn btn-sm btn-outline"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p>{c.text}</p>
                                                        {user?.uid === c.userId && (
                                                            <div className="flex gap-2 text-xs mt-1">
                                                                <span
                                                                    onClick={() => {
                                                                        setEditMode((prev) => ({
                                                                            ...prev,
                                                                            [c._id]: true,
                                                                        }));
                                                                        setEditTexts((prev) => ({
                                                                            ...prev,
                                                                            [c._id]: c.text,
                                                                        }));
                                                                    }}
                                                                    className="text-blue-500 cursor-pointer"
                                                                >
                                                                    Edit
                                                                </span>
                                                                <span
                                                                    onClick={() => handleDeleteComment(_id, c._id)}
                                                                    className="text-red-500 cursor-pointer"
                                                                >
                                                                    Delete
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                        <div className="mt-2 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                className="input input-bordered w-full"
                                                value={commentText}
                                                onChange={(e) =>
                                                    setCommentTexts((prev) => ({
                                                        ...prev,
                                                        [_id]: e.target.value,
                                                    }))
                                                }
                                            />
                                            <button
                                                onClick={() => handleComment(_id, commentText)}
                                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default QueryCardHome;