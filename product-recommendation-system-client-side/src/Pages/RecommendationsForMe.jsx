import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

const CARDS_PER_PAGE = 6 * 3;

const RecommendationsForMe = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get('https://productrecommendationsystem.vercel.app/addquery');
                const sorted = res.data.sort((a, b) => {
                    const aCount = typeof a.recommendationCount === 'number' ? a.recommendationCount : (a.likes ? a.likes.length : 0);
                    const bCount = typeof b.recommendationCount === 'number' ? b.recommendationCount : (b.likes ? b.likes.length : 0);
                    return bCount - aCount;
                });
                setProducts(sorted.slice(0, 50));
            } catch (err) {
                setProducts([]);
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Search filter
    const filtered = products.filter(prod =>
        prod.productname?.toLowerCase().includes(search.toLowerCase()) ||
        prod.productbrand?.toLowerCase().includes(search.toLowerCase()) ||
        prod.alternativeproduct?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

    const handlePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    return (
        <div className="min-h-screen p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Top Recommended Products</h2>
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search by product name, brand, or alternative..."
                    className="input input-bordered w-full max-w-xl"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
            </div>
            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">Loading...</div>
            ) : paginated.length === 0 ? (
                <div className="text-center">No products found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {paginated.map(prod => (
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
            )}
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button className="btn" onClick={() => handlePage(page - 1)} disabled={page === 1}>Prev</button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`btn ${page === idx + 1 ? 'btn-active btn-primary' : ''}`}
                            onClick={() => handlePage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button className="btn" onClick={() => handlePage(page + 1)} disabled={page === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
};

export default RecommendationsForMe;