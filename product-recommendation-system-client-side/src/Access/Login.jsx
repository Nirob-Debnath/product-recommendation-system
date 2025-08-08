import React, { useContext } from 'react';
import loginlottie from '../assets/lotties/login.json'
import Lottie from 'lottie-react';
import { AuthContext } from '../Auth/AuthContext';
import SocialLogin from './SocialLogin';
import { Link, useLocation, useNavigate } from 'react-router';

const Login = () => {

    const { signInUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state || '/';

    const handleLogin = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password);

        //login user
        signInUser(email, password)
            .then(result => {
                console.log(result.user);
                navigate(from);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <Lottie style={{ width: '400px' }} animationData={loginlottie} loop={true}></Lottie>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mr-96">
                    <div className="card-body">
                        <h1 className="text-5xl font-bold">Log In Now!</h1>
                        <form onSubmit={handleLogin} className="fieldset">
                            <label className="label">Email</label>
                            <input type="email" name="email" className="input" placeholder="Email" />
                            <label className="label">Password</label>
                            <input type="password" name="password" className="input" placeholder="Password" />
                            <div><a className="link link-hover">Forgot password?</a></div>
                            <button className="btn btn-neutral mt-4">Login</button>
                        </form>
                        <SocialLogin from={from}></SocialLogin>
                        <h2>Don't have an account? <Link className='text-blue-600' to="/signup">Sign Up</Link> </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;