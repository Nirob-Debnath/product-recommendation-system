import React from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';

const QueryCard = ({ query, querys, setQuery }) => {
    const { _id, productname, productbrand, productimageurl, alternativeproduct, boycottreason, additionalnotes } = query;

    const handleDelete = (_id) => {
        console.log(_id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
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
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                            //remove query from the state
                            const remainingQueries = querys.filter(que => que._id !== _id);
                            setQuery(remainingQueries);
                        }
                    })
            }
        });
    }

    return (
        <div>
            <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                    <img className="object-cover h-48 w-full" src={productimageurl} alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{productname}</h2>
                    <p>Product Brand: {productbrand}</p>
                    <p>Alternative Product: {alternativeproduct}</p>
                    <p>Boycott Reason: {boycottreason}</p>
                    <p>Additional Notes: {additionalnotes}</p>
                    <div className="card-actions justify-end">
                        <div className="join space-x-2 join-vertical lg:join-horizontal">
                            <Link to={`/viewdetails/${_id}`}><button className="btn join-item">View Details</button></Link>
                            <Link to={`/updatedetails/${_id}`}><button className="btn join-item">Edit</button></Link>
                            <button onClick={() => handleDelete(_id)} className="btn join-item">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryCard;