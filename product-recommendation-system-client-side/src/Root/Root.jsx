import React from 'react';
import NavBar from '../Components/NavBar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';
import { ThemeProvider } from '../ThemeContext/ThemeContext';

const Root = () => {
    return (
        <div>
            <ThemeProvider>
                <NavBar></NavBar>
                <Outlet></Outlet>
                <Footer></Footer>
            </ThemeProvider>
        </div>
    );
};

export default Root;