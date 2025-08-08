import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import QueryCard from './QueryCard';
import { AuthContext } from '../Auth/AuthContext';

const MyQueries = () => {
    const { user } = useContext(AuthContext);
    const [querys, setQuery] = useState([]);
    const [loading, setLoading] = useState(true);

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
        return <div className="text-center mt-12">Loading your queries...</div>;
    }

    return (
        <div className='mx-12 min-h-screen'>
            <Link to='/addqueries'>
                <button className="btn btn-primary w-full my-12">+ Add New Queries</button>
            </Link>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {
                    querys.map(query => (
                        <QueryCard key={query._id} query={query} querys={querys} setQuery={setQuery} />
                    ))
                }
            </div>
        </div>
    );
};

export default MyQueries;