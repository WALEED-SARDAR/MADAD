import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

function Home() {
    return (
        <div className="max-w-7xl mx-auto">
            {/*HERO SECTION*/}
            <div className="py-24 px-12 text-center">
                <h1 className="text-6xl font-bold text-gray-900">
                    <span className="block">Make a Difference in</span>
                    <span className="block text-green-700">Pakistan</span>
                </h1>
                <p className="mx-auto text-gray-500 mt-5 text-xl max-w-3xl">
                    Support causes that matter. Join our crowdfunding platform to raise funds for education, healthcare, emergencies, and more.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link to="/campaign/all" className="border rounded-md bg-gray-700 hover:bg-gray-500 text-white px-4 py-2">
                        Browse Campaigns
                    </Link>
                    <Link to="/about" className="border rounded-md bg-blue-700 hover:bg-blue-500 text-white px-4 py-2">
                        Learn More
                    </Link>
                </div>
            </div>

            {/*FEATURES SECTION*/}
            <div className="py-12 px-6 bg-gray-100">
                <div>
                    <h2 className="text-center text-3xl font-bold text-green-700">HOW IT WORKS</h2>
                    <p className="text-center font-bold text-3xl mt-3">Start With 3 Easy Steps</p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center">
                        {/** Step 1 */}
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-700 text-white text-xl font-bold">
                            1
                        </div>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Create Your Campaign</h2>
                        <p className="mt-2 text-gray-600 text-center">
                            Sign up and create your fundraising campaign in minutes. Add your story, photos, and funding goal.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        {/** Step 2 */}
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-700 text-white text-xl font-bold">
                            2
                        </div>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Share Your Story</h2>
                        <p className="mt-2 text-gray-600">
                            Share your campaign with friends, family, and your community through social media and messaging.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        {/** Step 3 */}
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-700 text-white text-xl font-bold">
                            3
                        </div>
                        <h2 className=" mt-1 text-2xl font-semibold text-gray-900">Recive Donations</h2>
                        <p className="mt-2 text-gray-600">
                            Collect donations securely through our platform and track your progress in real-time.</p>
                    </div>
                </div>
            </div>

            { /*WHY CHOOSE US*/}
            <div className="mx-auto py-12 px-6">
                <div>
                    <h2 className="text-3xl text-center font-bold text-green-700">WHY CHOOSE MADAD</h2>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-8">
                     {/** Feature 1 */}
                    <div className="bg-gray-200 rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 text-5xl">
                            😲
                        </div>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Fast & Easy</h2>
                        <p className="mt-2 text-gray-600">
                            Our user-friendly platform makes it easy to create, share, and manage your campaigns with just a few clicks.
                        </p>
                    </div>
                     {/** Feature 2 */}
                    <div className="bg-gray-200 rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 text-5xl">
                            🚧
                        </div>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Security</h2>
                        <p className="mt-2 text-gray-600">
                            We prioritize your security and privacy. Our platform is built with the latest security measures.
                        </p>
                    </div>
                     {/** Feature 3 */}
                    <div className="bg-gray-200 rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 text-5xl">
                            🤝
                        </div>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Community</h2>
                        <p className="mt-2 text-gray-600">
                            Join a community of like-minded individuals who are passionate about making a positive impact in Pakistan.
                        </p>
                    </div> 
                   
                </div>
            </div>
        </div>
    )
}

export default Home