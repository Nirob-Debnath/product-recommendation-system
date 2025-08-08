import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const ViewDetails = () => {
    const {
        _id,
        productname,
        productbrand,
        productimageurl,
        refinedproduct,
        boycottreason,
        additionalnotes,
        likes = [],
        comments = []
    } = useLoaderData();

    const [user, setUser] = useState(null);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [currentComments, setCurrentComments] = useState(comments);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);

    const auth = getAuth();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, [auth]);

    const hasLiked = user && currentLikes.includes(user.uid);

    const handleLike = async () => {
        if (!user) return alert('Please login to like.');

        try {
            const res = await axios.patch(`https://productrecommendationsystem.vercel.app/addquery/${_id}/like`, {
                userId: user.uid,
            });

            if (res.data.success) {
                setCurrentLikes((prev) =>
                    res.data.liked ? [...prev, user.uid] : prev.filter((id) => id !== user.uid)
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async () => {
        if (!user || !newComment.trim()) return;

        try {
            const res = await axios.post(`https://productrecommendationsystem.vercel.app/addquery/${_id}/comment`, {
                userId: user.uid,
                username: user.displayName || 'Anonymous',
                text: newComment.trim(),
            });

            if (res.data.success) {
                setCurrentComments([...currentComments, res.data.comment]);
                setNewComment('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`https://productrecommendationsystem.vercel.app/addquery/${_id}/comment/${commentId}`);
            setCurrentComments(currentComments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditComment = async () => {
        if (!editingComment?.text.trim()) return;

        try {
            await axios.put(
                `https://productrecommendationsystem.vercel.app/addquery/${_id}/comment/${editingComment._id}`,
                { text: editingComment.text.trim() }
            );

            setCurrentComments(prev =>
                prev.map(c =>
                    c._id === editingComment._id
                        ? { ...c, text: editingComment.text.trim(), updatedAt: new Date() }
                        : c
                )
            );
            setEditingComment(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Product Details</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <img src={productimageurl} alt={productname} className="rounded-lg shadow-md" />
                <div>
                    <h2 className="text-2xl font-semibold">{productname}</h2>
                    <p><strong>Brand:</strong> {productbrand}</p>
                    <p><strong>Refined Product:</strong> {refinedproduct}</p>
                    <p><strong>Boycott Reason:</strong> {boycottreason}</p>
                    {additionalnotes && <p><strong>Additional Notes:</strong> {additionalnotes}</p>}

                    <div className="mt-4">
                        <button
                            onClick={handleLike}
                            className={`px-4 py-2 rounded ${hasLiked ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                        >
                            {hasLiked ? 'Unlike' : 'Like'} ({currentLikes.length})
                        </button>
                    </div>
                </div>
            </div>

            <hr className="my-6" />

            <div>
                <h3 className="text-xl font-semibold mb-3">Comments ({currentComments.length})</h3>

                {currentComments.map((comment) => (
                    <div key={comment._id} className="border p-3 rounded mb-3 relative">
                        <p className="font-semibold">{comment.username}</p>
                        <p>{comment.text}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.updatedAt).toLocaleString()}</p>
                        {user?.uid === comment.userId && (
                            <div className="absolute right-2 top-2 space-x-2">
                                <button
                                    onClick={() => setEditingComment(comment)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {editingComment ? (
                    <div className="mt-4">
                        <textarea
                            value={editingComment.text}
                            onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={3}
                        ></textarea>
                        <div className="space-x-2 mt-2">
                            <button onClick={handleEditComment} className="px-4 py-1 bg-green-500 text-white rounded">Save</button>
                            <button onClick={() => setEditingComment(null)} className="px-4 py-1 bg-gray-400 text-white rounded">Cancel</button>
                        </div>
                    </div>
                ) : (
                    user && (
                        <div className="mt-6">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-2 border rounded"
                                rows={3}
                            ></textarea>
                            <button
                                onClick={handleAddComment}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Add Comment
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ViewDetails;