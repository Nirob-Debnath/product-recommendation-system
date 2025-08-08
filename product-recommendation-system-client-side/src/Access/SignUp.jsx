import React, { useContext } from 'react';
import Lottie from "lottie-react";
import signuplottie from "../assets/lotties/signup-lottie.json"
import { AuthContext } from '../Auth/AuthContext';
import SocialLogin from './SocialLogin';
import { Link } from 'react-router';

const SignUp = () => {

    const { createUser } = useContext(AuthContext);

    const handleSignUp = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const photoURL = e.target.photourl.value;
        const password = e.target.password.value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        createUser(email, password)
            .then(result => {
                const user = result.user;
                // Update profile if supported
                user.updateProfile?.({
                    displayName: name,
                    photoURL: photoURL
                });
                console.log(user);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center ml-20 lg:text-left">
                    <Lottie style={{ width: '300px' }} animationData={signuplottie} loop={true} />
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <h1 className="text-5xl font-bold">Sign Up Now!</h1>
                        <form onSubmit={handleSignUp} className="fieldset">
                            <label htmlFor="name" className="label">Name</label>
                            <input id="name" type="text" name="name" className="input" placeholder="Name" />
                            <label htmlFor="email" className="label">Email</label>
                            <input id="email" type="email" name="email" className="input" placeholder="Email" />
                            <label htmlFor="photourl" className="label">Photo URL</label>
                            <input id="photourl" type="url" name="photourl" className="input" placeholder="Photo URL" />
                            <label htmlFor="password" className="label">Password</label>
                            <input id="password" type="password" name="password" className="input" placeholder="Password" />
                            <div><Link className="link link-hover" to="/forgot-password">Forgot password?</Link></div>
                            <button className="btn btn-neutral mt-4">Sign Up</button>
                        </form>
                        <SocialLogin />
                        <h2>Already have an account? <Link className='text-blue-600' to="/login">Login</Link></h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;