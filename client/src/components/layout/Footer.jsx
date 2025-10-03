import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-300 py-6 mt-10">
            <div className='grid grid-cols-3 max-w-7xl mx-auto'>
                {/* Footer content */}
                <div>
                    <Link to="/" className="text-2xl text-green-700 font-bold">MADAD</Link>
                    <p className="text-gray-500 mt-2 text-sm">Empowering dreams through Funding. Connect with donors and make a difference...</p>
                </div>
                {/*QUICK LINKS */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-2">Quick Links</h3>
                    <ul>
                        <li><Link to="/campaign/all" className='text-gray-500 hover:text-green-700'>Browse Campaigns</Link></li>
                        <li><Link to="/about" className="text-gray-500 hover:text-green-700">About Us</Link></li>
                        <li><Link to="/contact" className="text-gray-500 hover:text-green-700">Contact Us</Link></li>
                    </ul>
                </div>
                {/*CONTACT INFO */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-2 ">Contact Info</h3>
                    <div className="text-gray-500 text-sm">
                        <p >Have any questions? Reach out to us at:</p>
                        <p>Email: support@madad.com</p>
                        <p>Phone: +123 456 7890</p>
                    </div>
                </div>
            </div>
            {/*COPYRIGHT */}
            <div className="max-w-7xl mx-auto border-t border-gray-300 font-bold text-center text-gray-500 mt-4 pt-4">
                <p>&copy; 2023 MADAD. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
