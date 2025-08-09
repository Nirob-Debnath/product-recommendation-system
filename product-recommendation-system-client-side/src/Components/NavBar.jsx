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
        <li><NavLink to="/" className="nav-link">Home</NavLink></li>
        <li><NavLink to="/queries" className="nav-link">Queries</NavLink></li>
        {
            user ? <>
                <li><NavLink to="/recommendationsforme" className="nav-link">Recommendations For Me</NavLink></li>
                <li><NavLink to="/myqueries" className="nav-link">My Queries</NavLink></li>
                <li><NavLink to="/myrecommendations" className="nav-link">My Recommendations</NavLink></li>
            </> : <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
        }
    </>

    return (
        <nav
            className="sticky top-0 left-0 w-full z-50 shadow-sm"
            style={{
                background: 'var(--color-primary)',
                color: 'var(--color-text-light)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <NavLink to="/" className="flex items-center gap-2">
                        <img src="/vite.svg" alt="Logo" className="h-6 w-6" />
                        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-accent)' }}>Suggest-IQ</span>
                    </NavLink>
                </div>

                {/* Center: Desktop Menu */}
                <ul className="hidden md:flex items-center gap-6 text-base font-medium flex-grow justify-center">
                    {links}
                </ul>

                {/* Right: Theme Toggle & Auth */}
                <div className="flex items-center gap-3">
                    <button className="text-xl" onClick={toggleTheme} title="Toggle theme">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    {user && (
                        <button onClick={handleSignOut} className="button-filled">Sign Out</button>
                    )}
                    {/* Mobile Menu */}
                    <div className="md:hidden dropdown">
                        <button tabIndex={0} className="btn btn-ghost p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </button>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-white text-black z-50">
                            {links}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;