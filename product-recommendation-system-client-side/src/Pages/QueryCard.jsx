import React from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';

const QueryCard = ({ query, querys, setQuery }) => {
    const { _id, productname, productbrand, productimageurl, alternativeproduct } = query;

    const handleDelete = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://productrecommendationsystem.vercel.app/addquery/${_id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your query has been deleted.",
                                icon: "success"
                            });
                            const remainingQueries = querys.filter(que => que._id !== _id);
                            setQuery(remainingQueries);
                        }
                    });
            }
        });
    };

    // Define a single button color class for all buttons
    const btnColorClass = "bg-blue-600 hover:bg-blue-700";

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100
            flex flex-col justify-between h-[400px]">
            {/* Image */}
            <figure className="relative">
                <img
                    className="object-cover h-40 w-full"
                    src={productimageurl}
                    alt={productname}
                />
            </figure>

            {/* Card Body */}
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{productname}</h2>
                    <p className="text-sm text-gray-600"><span className="font-medium">Brand:</span> {productbrand}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Alternative:</span> {alternativeproduct}</p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4 gap-2">
                    <Link to={`/viewdetails/${_id}`} className="flex-1 min-w-0">
                        <button className={`w-full btn text-white ${btnColorClass}`}>
                            View
                        </button>
                    </Link>
                    <Link to={`/updatedetails/${_id}`} className="flex-1 min-w-0">
                        <button className={`w-full btn text-white ${btnColorClass}`}>
                            Edit
                        </button>
                    </Link>
                    <button
                        onClick={() => handleDelete(_id)}
                        className={`flex-1 btn text-white w-full min-w-0 ${btnColorClass}`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QueryCard;