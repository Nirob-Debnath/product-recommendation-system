import React from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

const UpdateDetails = () => {

    const { _id, productname, productbrand, productimageurl, refinedproduct, boycottreason, additionalnotes } = useLoaderData();

    const handleUpdateQuery = e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const updatedQuery = Object.fromEntries(formData.entries());
        console.log(updatedQuery);

        fetch(`https://productrecommendationsystem.vercel.app/addquery/${_id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedQuery)
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    return (
        <div className='px-24 py-12 min-h-screen'>
            <div className='flex-col justify-center items-center text-center gap-y-12'>
                <h1 className='text-6xl'>Update Query</h1>
                <form onSubmit={handleUpdateQuery}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <label className="label">Product Name</label>
                            <input type="text" name="productname" defaultValue={productname} className="input w-full" placeholder="Product Name" required />
                        </fieldset>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <label className="label">Product Brand</label>
                            <input type="text" name="productbrand" defaultValue={productbrand} className="input w-full" placeholder="Product Brand" required />
                        </fieldset>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <label className="label">Product Image-URL</label>
                            <input type="text" name="productimageurl" defaultValue={productimageurl} className="input w-full" placeholder="Product Image-URL" required />
                        </fieldset>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <label className="label">Is there any better product that gives me the same quality?</label>
                            <input type="text" name="refinedproduct" defaultValue={refinedproduct} className="input w-full" placeholder="Answer" required />
                        </fieldset>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <label className="label">Boycotting Reason Details</label>
                            <input type="text" name="boycottreason" defaultValue={boycottreason} className="input w-full" placeholder="Boycotting Reason Details" required />
                        </fieldset>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <label className="label">Additional Notes</label>
                            <input type="text" name="additionalnotes" defaultValue={additionalnotes} className="input w-full" placeholder="Additional Notes" required />
                        </fieldset>
                    </div>
                    <input className='btn w-full btn-primary mt-8' type="submit" value="Update Query" />
                </form>
            </div>
        </div>
    );
};

export default UpdateDetails;