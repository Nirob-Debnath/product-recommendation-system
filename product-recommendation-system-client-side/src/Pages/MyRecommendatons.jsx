import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MyRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    // Fetch recommendations for the logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user?.email) {
                try {
                    const res = await axios.get(`https://productrecommendationsystem.vercel.app/recommendations?email=${user.email}`);
                    setRecommendations(res.data);
                } catch (error) {
                    console.error('Error fetching recommendations:', error);
                } finally {
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Handle recommendation delete
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete your recommendation permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`https://productrecommendationsystem.vercel.app/recommendations/${id}`);
                setRecommendations(prev => prev.filter(rec => rec._id !== id));
                Swal.fire('Deleted!', 'Your recommendation has been deleted.', 'success');
            } catch (error) {
                console.error('Delete error:', error);
                Swal.fire('Error!', 'Failed to delete recommendation.', 'error');
            }
        }
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-xl font-semibold">Loading...</div>;
    }

    if (recommendations.length === 0) {
        return <div className="h-screen flex items-center justify-center text-lg">No recommendations found.</div>;
    }

    return (
        <div className="h-screen p-4 bg-gray-50 overflow-y-auto min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-center">My Recommendations</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-md">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Query ID</th>
                            <th className="px-4 py-2 text-left">Text</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recommendations.map((rec, index) => (
                            <tr key={rec._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2 text-blue-600">{rec.queryId}</td>
                                <td className="px-4 py-2">{rec.text?.slice(0, 50)}...</td>
                                <td className="px-4 py-2">{new Date(rec.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(rec._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyRecommendations;