import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';
import { useTheme } from '../ThemeContext/ThemeContext';

const NavBar = () => {

    const { user, signOutUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                console.log('sign out user');
            })
            .catch(error => {
                console.log(error);
            })
    }

    const links = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/queries">Queries</NavLink></li>
        {
            user && <>
                <li><NavLink to="/recommendationsforme">Recommendation For Me</NavLink></li>
                <li><NavLink to="/myqueries">My Queries</NavLink></li>
                <li><NavLink to="/myrecommendations">My Recommendations</NavLink></li>
            </>
        }
    </>

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <NavLink className="text-xl font-bold text-[#5f5cff]" to="/">Suggest-IQ</NavLink>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end gap-4">
                <button className='cursor-pointer' onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                {
                    user ? <button onClick={handleSignOut} className='btn btn-primary'>Sign Out</button> :
                        <>
                            <NavLink to="/login" className="btn btn-primary">Login</NavLink>
                        </>
                }

            </div>
        </div>
    );
};

export default NavBar;