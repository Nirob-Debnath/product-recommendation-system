import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { Link } from 'react-router';

const CARDS_PER_ROW = 6;

const MyRecommendations = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser?.uid) {
                try {
                    const res = await axios.get('https://productrecommendationsystem.vercel.app/addquery');
                    // Filter products where user.uid is in likes array
                    const recommended = res.data.filter(prod => Array.isArray(prod.likes) && prod.likes.includes(firebaseUser.uid));
                    setProducts(recommended);
                } catch {
                    setProducts([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setProducts([]);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-xl font-semibold">Loading...</div>;
    }

    if (!user) {
        return <div className="h-screen flex items-center justify-center text-lg">Please log in to see your recommendations.</div>;
    }

    if (products.length === 0) {
        return <div className="h-screen flex items-center justify-center text-lg">No recommendations found.</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">My Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {products.map(prod => (
                    <div key={prod._id} className="card bg-base-100 shadow-md border flex flex-col">
                        <figure>
                            <img
                                src={prod.productimageurl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={prod.productname || 'Product'}
                                className="h-32 w-full object-cover"
                            />
                        </figure>
                        <div className="card-body flex flex-col items-center text-center p-4">
                            <h2 className="card-title text-base font-semibold mb-1">{prod.productname}</h2>
                            <p className="text-sm text-gray-600 mb-1">Brand: {prod.productbrand}</p>
                            <p className="text-sm text-gray-600 mb-1">Alternative: {prod.alternativeproduct || '-'}</p>
                            <p className="text-sm font-medium mb-2">Recommendations: {typeof prod.recommendationCount === 'number' ? prod.recommendationCount : (prod.likes ? prod.likes.length : 0)}</p>
                            <div className="card-actions mt-auto w-full flex justify-center">
                                <Link to={`/viewdetails/${prod._id}`} className="btn btn-primary w-full">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRecommendations;