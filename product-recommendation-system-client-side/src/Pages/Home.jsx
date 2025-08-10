import React from "react";
import SwiperComponent from "./Swiper";
import QueryCardHome from "./QueryCardHome";
import RecentQueries from "./RecentQueries";

const Home = () => {
    return (
        <main className="bg-[var(--color-bg)] text-[var(--color-text)]">
            {/* 1. Hero/Slider Section */}
            <section className="w-full flex flex-col md:flex-row items-center justify-center py-12 bg-[var(--color-primary)] text-[var(--color-text-light)]">
                {/* Left: Hero/Slider (60%) */}
                <div className="w-full md:w-[60%] flex justify-center mb-8 md:mb-0">
                    <div className="w-full max-w-2xl">
                        <SwiperComponent />
                    </div>
                </div>
                {/* Right: Two stacked sections (40%) */}
                <div className="w-full md:w-[40%] flex flex-col gap-6 items-center md:items-start px-4">
                    {/* Top Section */}
                    <div className="bg-[var(--color-bg)] bg-opacity-80 rounded-lg p-6 shadow w-full">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--color-primary)]">Welcome to Suggest-IQ</h1>
                        <p className="mb-4 text-lg text-[var(--color-text)]">Get the best product recommendations and share your experiences with our community.</p>
                        <a href="/queries" className="button-filled p-3">See Queries</a>
                    </div>
                    {/* Bottom Section */}
                    <div className="bg-[var(--color-secondary)] bg-opacity-90 rounded-lg p-6 shadow w-full flex flex-col items-start">
                        <h2 className="text-xl font-semibold mb-2 text-[var(--color-accent)]">Why Use Suggest-IQ?</h2>
                        <ul className="list-disc pl-5 text-[var(--color-text-light)]">
                            <li>Real user reviews and recommendations</li>
                            <li>Find the best products for your needs</li>
                            <li>Share your own experiences and help others</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. Featured Products/Queries */}
            <section className="max-w-7xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
                {/* Use QueryCardHome to display dynamic featured products/queries */}
                <QueryCardHome showSearch={false} limit={12} />
            </section>

            {/* 3. Recent Queries */}
            <section className="max-w-7xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Recent Queries</h2>
                <RecentQueries />
            </section>

            {/* 4. How It Works */}
            <section className="bg-[var(--color-bg-dark)] text-[var(--color-text-light)] py-10">
                <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    <div className="flex flex-col items-center max-w-xs">
                        <span className="text-4xl mb-2">📝</span>
                        <h4 className="font-semibold mb-1">Add Your Query</h4>
                        <p className="text-sm text-center">Post your product question or experience to get real feedback from the community.</p>
                    </div>
                    <div className="flex flex-col items-center max-w-xs">
                        <span className="text-4xl mb-2">💡</span>
                        <h4 className="font-semibold mb-1">Get Recommendations</h4>
                        <p className="text-sm text-center">Receive personalized product suggestions and advice from real users.</p>
                    </div>
                    <div className="flex flex-col items-center max-w-xs">
                        <span className="text-4xl mb-2">⭐</span>
                        <h4 className="font-semibold mb-1">Review & Connect</h4>
                        <p className="text-sm text-center">Review recommendations, connect with others, and make informed decisions.</p>
                    </div>
                </div>
            </section>

            {/* 5. Promotions/Highlights */}
            <section className="max-w-7xl mx-auto py-10 px-4">
                <div className="bg-[var(--color-accent)] text-[var(--color-bg-dark)] rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">Special Promotion</h2>
                    <p className="mb-2">Join now and get exclusive access to our top recommendations!</p>
                    <ul className="flex flex-col md:flex-row gap-2 justify-center mt-4">
                        <li className="font-medium">• Free premium trial for 1 month</li>
                        <li className="font-medium">• Early access to new features</li>
                        <li className="font-medium">• Priority support for members</li>
                    </ul>
                </div>
            </section>

            {/* 6. User Reviews/Testimonials */}
            <section className="max-w-7xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Example testimonials */}
                    <div className="bg-[var(--color-primary)] text-[var(--color-text-light)] rounded-lg shadow p-6 flex flex-col items-center">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" className="h-16 w-16 rounded-full mb-2" />
                        <p className="italic mb-2">“I found the perfect laptop for my needs thanks to Suggest-IQ!”</p>
                        <span className="font-semibold">— Alex R.</span>
                    </div>
                    <div className="bg-[var(--color-primary)] text-[var(--color-text-light)] rounded-lg shadow p-6 flex flex-col items-center">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" className="h-16 w-16 rounded-full mb-2" />
                        <p className="italic mb-2">“The recommendations are spot on and the community is so helpful.”</p>
                        <span className="font-semibold">— Priya S.</span>
                    </div>
                    <div className="bg-[var(--color-primary)] text-[var(--color-text-light)] rounded-lg shadow p-6 flex flex-col items-center">
                        <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User 3" className="h-16 w-16 rounded-full mb-2" />
                        <p className="italic mb-2">“I love how easy it is to get advice and share my experiences.”</p>
                        <span className="font-semibold">— Michael T.</span>
                    </div>
                </div>
            </section>

            {/* 7. Newsletter Signup / Call to Action */}
            <section className="w-full flex flex-col items-center justify-center py-10 bg-[var(--color-secondary)] text-[var(--color-text-light)]">
                <h2 className="text-2xl font-bold mb-4">Stay Updated!</h2>
                <p className="mb-4 text-center max-w-md">Subscribe to our newsletter for the latest product tips, reviews, and exclusive offers.</p>
                <form className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        placeholder="Your email"
                        className="px-4 py-2 rounded-l border-none"
                    />
                    <button type="submit" className="button-filled p-4">Subscribe</button>
                </form>
                <p className="mt-2 text-xs opacity-80">We respect your privacy. Unsubscribe at any time.</p>
            </section>
        </main>
    );
};

export default Home;