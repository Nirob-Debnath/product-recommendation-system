import React from 'react';
import Carousel from './Carousel';
import QueryCardHome from './QueryCardHome';

const Home = () => {

    return (
        <div className='min-h-screen'>
            <Carousel></Carousel>
            <div className='mx-12'>
                <QueryCardHome></QueryCardHome>
            </div>
        </div>
    );
};

export default Home;