import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';

const AddQueries = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddQuery = async (e) => {
        e.preventDefault();
        const form = e.target;

        const queryData = {
            productname: form.productname.value,
            productbrand: form.productbrand.value,
            productimageurl: form.productimageurl.value,
            querytitle: form.querytitle.value,
            boycottreason: form.boycottreason.value,
            additionalnotes: form.additionalnotes.value,
            alternativeproduct: form.alternativeproduct.value,
            email: user?.email || 'anonymous',
            name: user?.displayName || 'Anonymous',
            userImage: user?.photoURL || '',
            createdAt: new Date().toISOString(),

        };

        try {
            const res = await fetch('https://productrecommendationsystem.vercel.app/addquery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(queryData),
            });

            const data = await res.json();

            if (data.insertedId || data.acknowledged) {
                Swal.fire({
                    icon: 'success',
                    title: 'Query posted successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                    position: 'top-end'
                });
                form.reset();
                navigate('/myqueries');
            } else {
                throw new Error('Failed to post query');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    };

    return (
    <div className='px-4 md:px-8 py-12 min-h-screen'>
            <div className='text-center'>
                <h1 className='text-4xl md:text-6xl font-bold'>Add New Query</h1>
                <p className='my-6 text-gray-600 max-w-3xl mx-auto'>
                    Share your concerns about any product. Help others find better alternatives by submitting your honest queries.
                </p>
            </div>

            <form onSubmit={handleAddQuery} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <fieldset className="fieldset border p-4 rounded-xl bg-base-200">
                    <label className="label font-semibold">Product Name</label>
                    <input type="text" name="productname" className="input w-full" placeholder="e.g., Coca-Cola" required />
                </fieldset>

                <fieldset className="fieldset border p-4 rounded-xl bg-base-200">
                    <label className="label font-semibold">Product Brand</label>
                    <input type="text" name="productbrand" className="input w-full" placeholder="e.g., Coca-Cola Company" required />
                </fieldset>

                <fieldset className="fieldset border p-4 rounded-xl bg-base-200 col-span-1 md:col-span-2">
                    <label className="label font-semibold">Product Image URL</label>
                    <input type="text" name="productimageurl" className="input w-full" placeholder="https://example.com/image.jpg" required />
                </fieldset>

                <fieldset className="fieldset border p-4 rounded-xl bg-base-200 col-span-1 md:col-span-2">
                    <label className="label font-semibold">Query Title</label>
                    <input type="text" name="querytitle" className="input w-full" placeholder="Is there any better product with the same quality?" required />
                </fieldset>

                <fieldset className="fieldset border p-4 rounded-xl bg-base-200 col-span-1 md:col-span-2">
                    <label className="label font-semibold">Boycotting Reason</label>
                    <textarea name="boycottreason" className="textarea w-full" placeholder="Why don't you want this product?" required />
                </fieldset>

                <fieldset className="fieldset border p-4 rounded-xl bg-base-200 col-span-1 md:col-span-2">
                    <label className="label font-semibold">Alternative Product</label>
                    <input type="text" name="alternativeproduct" className="input w-full" placeholder="New brand" />
                </fieldset>

                <fieldset className="fieldset border p-4 rounded-xl bg-base-200 col-span-1 md:col-span-2">
                    <label className="label font-semibold">Additional Notes</label>
                    <textarea name="additionalnotes" className="textarea w-full" placeholder="Any extra comments or thoughts?" required />
                </fieldset>

                <input type="submit" className="btn btn-primary text-color-text-light col-span-1 md:col-span-2 mt-6" value="Post Query" />
            </form>
        </div>
    );
};

export default AddQueries;
