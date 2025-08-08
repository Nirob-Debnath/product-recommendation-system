import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const RecommendationsForMe = () => {
    const [user, setUser] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
            setUser(loggedInUser);
            setLoading(true);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const fetchRecommendationsForUser = async () => {
            if (!user?.email) {
                setRecommendations([]);
                setLoading(false);
                return;
            }

            try {
                const queryRes = await axios.get('https://productrecommendationsystem.vercel.app/addquery');
                // Filter queries created by current user email
                const myQueries = queryRes.data.filter(q => q.userEmail === user.email);
                const myQueryIds = myQueries.map(q => q._id);

                const recRes = await axios.get('https://productrecommendationsystem.vercel.app/recommendations');
                const allRecommendations = recRes.data;

                // Filter recommendations that belong to user's queries
                const myRecommendations = allRecommendations.filter(rec =>
                    rec.queryId && myQueryIds.includes(rec.queryId)
                );

                setRecommendations(myRecommendations);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendationsForUser();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg">
                Please log in to see your recommendations.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Recommendations for Your Queries</h2>
            {recommendations.length === 0 ? (
                <p>No recommendations found for your queries yet.</p>
            ) : (
                <div className="overflow-x-auto w-full max-w-6xl">
                    <table className="table-auto w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Query ID</th>
                                <th className="px-4 py-2">Recommended By</th>
                                <th className="px-4 py-2">Recommendation</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.map((rec, index) => (
                                <tr key={rec._id || index} className="border-t">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{rec.queryId || 'N/A'}</td>
                                    <td className="px-4 py-2">{rec.userEmail || 'Anonymous'}</td>
                                    <td className="px-4 py-2">{rec.recommendationText || 'N/A'}</td>
                                    <td className="px-4 py-2">
                                        {rec.date ? new Date(rec.date).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecommendationsForMe;