import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';


const Queries = () => {
    const [queries, setQueries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 18;

    useEffect(() => {
        fetch('https://productrecommendationsystem.vercel.app/addquery', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setQueries(sorted);
            })
            .catch(err => console.error('Failed to fetch queries:', err));
    }, []);

    // Search filter
    const filteredQueries = queries.filter(query => {
        const lower = searchTerm.toLowerCase();
        return (
            (query.querytitle && query.querytitle.toLowerCase().includes(lower)) ||
            (query.productname && query.productname.toLowerCase().includes(lower)) ||
            (query.productbrand && query.productbrand.toLowerCase().includes(lower)) ||
            (query.boycottreason && query.boycottreason.toLowerCase().includes(lower)) ||
            (query.additionalnotes && query.additionalnotes.toLowerCase().includes(lower))
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredQueries.length / cardsPerPage);
    const startIdx = (currentPage - 1) * cardsPerPage;
    const endIdx = startIdx + cardsPerPage;
    const paginatedQueries = filteredQueries.slice(startIdx, endIdx);

    return (
        <div className="p-4 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold">All Queries</h1>
                <input
                    type="text"
                    placeholder="Search queries..."
                    className="input input-bordered w-full max-w-xs"
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {paginatedQueries.length === 0 ? (
                    <p className="col-span-full text-center">No queries found.</p>
                ) : (
                    paginatedQueries.map(query => (
                        <div key={query._id} className="card bg-base-100 shadow-md border w-full max-w-[200px] min-h-[340px] mx-auto flex flex-col">
                            <figure>
                                <img
                                    src={query.productimageurl || ''}
                                    alt="Product"
                                    className="h-40 w-full object-cover"
                                />
                            </figure>
                            <div className="card-body flex flex-col items-center text-center p-4">
                                <h2 className="card-title text-base font-semibold mb-1">{query.querytitle || 'No Title'}</h2>
                                <p className="text-sm text-gray-600 mb-1">Brand: {query.productbrand}</p>
                                <p className="text-sm text-gray-600 mb-1">Alternative: {query.alternativeproduct || '-'}</p>
                                <p className="text-sm font-medium mb-2">Recommendations: {(typeof query.recommendationCount === 'number' ? query.recommendationCount : (query.likes ? query.likes.length : 0))}</p>
                                <div className="card-actions mt-auto w-full flex justify-center">
                                    <Link to={`/viewdetails/${query._id}`}>
                                        <button className="btn btn-primary w-full">View Details</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2 flex-wrap">
                    <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Queries;