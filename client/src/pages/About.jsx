import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">About FundMe</h1>

            {/* Mission Statement */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-600 text-lg">
                    FundMe is dedicated to empowering Pakistanis to raise funds for causes
                    that matter. We believe in the power of community and collective action
                    to create positive change in society.
                </p>
            </div>

            {/* How It Works */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
                            1
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">Create Your Campaign</h3>
                            <p className="text-gray-600">
                                Set up your fundraising campaign in minutes with our easy-to-use
                                platform.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
                            2
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">Share Your Story</h3>
                            <p className="text-gray-600">
                                Share your campaign with your network and reach potential donors.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
                            3
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">Receive Funds</h3>
                            <p className="text-gray-600">
                                Get donations directly to your account through our secure payment
                                system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Ready to Start Your Campaign?
                </h2>
                <p className="text-gray-600 mb-6">
                    Join thousands of others who have successfully raised funds for their
                    causes.
                </p>
                <Link to="/campaign/create">
                    <button className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-600 cursor-pointer">
                        Start Fundraising
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default About;
