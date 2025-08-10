import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import QueryCard from './QueryCard';
import { AuthContext } from '../Auth/AuthContext';

const MyQueries = () => {
    const { user } = useContext(AuthContext);
    const [querys, setQuery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18; // Show 18 cards per page

    useEffect(() => {
        if (user?.email) {
            fetch(`https://productrecommendationsystem.vercel.app/addquery?email=${user.email}`)
                .then(res => res.json())
                .then(data => {
                    setQuery(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return <div className="text-center mt-12 text-lg font-semibold">Loading your queries...</div>;
    }

    // Filter queries by search term (product name or brand)
    const filteredQueries = querys.filter(q =>
        q.productname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.productbrand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQueries.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="mx-12 min-h-screen">
            {/* Add New Queries Button */}
            <Link to='/addqueries'>
                <button className="btn bg-blue-600 hover:bg-blue-700 text-white w-full my-12">
                    + Add New Queries
                </button>
            </Link>

            {/* Search Box */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search by product name or brand..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="input input-bordered w-full max-w-lg rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {currentItems.map(query => (
                    <div key={query._id} className="flex flex-col h-[400px] min-w-0">
                        <QueryCard query={query} querys={querys} setQuery={setQuery} />
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    className="btn bg-gray-300 hover:bg-gray-400"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={`btn ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="btn bg-gray-300 hover:bg-gray-400"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MyQueries;