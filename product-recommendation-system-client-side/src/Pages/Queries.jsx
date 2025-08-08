import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaThLarge, FaTh } from 'react-icons/fa';

const Queries = () => {
    const [queries, setQueries] = useState([]);
    const [isThreeColumn, setIsThreeColumn] = useState(true);

    useEffect(() => {
        fetch('https://productrecommendationsystem.vercel.app/addquery',{
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setQueries(sorted);
            })
            .catch(err => console.error('Failed to fetch queries:', err));
    }, []);

    const gridClass = isThreeColumn
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

    return (
        <div className="p-4 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">All Queries</h1>
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setIsThreeColumn(prev => !prev)}
                    title="Toggle Layout"
                >
                    {isThreeColumn ? <FaThLarge /> : <FaTh />}
                </button>
            </div>

            <div className={`grid gap-6 ${gridClass}`}>
                {queries.length === 0 ? (
                    <p className="col-span-full text-center">No queries found.</p>
                ) : (
                    queries.map(query => (
                        <div key={query._id} className="card bg-base-100 shadow-md border">
                            <figure>
                                <img
                                    src={query.productimageurl || ''}
                                    alt="Product"
                                    className="h-48 w-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{query.querytitle || 'No Title'}</h2>
                                <p className="text-sm text-gray-600">Brand: {query.productbrand}</p>
                                <p className="text-sm text-gray-500">By: {query.name || 'Anonymous'}</p>
                                <p className="text-sm text-gray-500">
                                    Created: {new Date(query.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm font-medium mt-2">
                                    Recommendations: {query.recommendationCount || 0}
                                </p>

                                <div className="card-actions mt-4 justify-end">
                                    <Link to={`/viewdetails/${query._id}`}>
                                        <button className="btn btn-primary btn-sm">Recommend</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Queries;