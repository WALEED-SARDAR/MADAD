import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className='bg-gray shadow-md'>
      <div className="justify-between max-w-7xl flex items-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex items-center h-14'>

          {/*logo*/}
          <Link to="/" className='flex items-center text-green-700 font-bold text-2xl'>
            MADAD
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              <Link to="/campaign/all" className='text-gray-500 hover:text-green-700 font-medium'>
                Browse Campaigns
              </Link>
              <Link to="/campaign/create" className='text-gray-500 hover:text-green-700 font-medium'>
                Create Campaign
              </Link>

              {/*user dropdown button*/}
              <div className='relative' ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='flex items-center gap-2 px-2 py-1 rounded-md hover:opacity-75 hover:text-green-700  cursor-pointer'>
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className='w-8 h-8 rounded-full object-cover' />
                  ) : (
                    <div className='w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold'>
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className='text-gray-500 font-medium hover:text-green-700'>
                    {user.name || user.username || (user.email ? user.email.split('@')[0] : 'User')}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/*dropdown menu items*/}
                {isDropdownOpen && (
                  <div role="menu" className='absolute right-0 mt-2 w-50 bg-white border border-gray-200 rounded-md shadow-lg z-50'>
                    <Link to="/user/dashboard" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100'>
                      Dashboard
                    </Link>
                    <Link to="/campaign/my-campaigns" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100'>
                      My Campaigns
                    </Link>
                    <Link to="/donation/my-donations" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100'>
                      My Donations
                    </Link>
                    <Link to="/user/profile" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100'>
                      Profile
                    </Link>
                    <hr className=' border-gray-300' />


                    {user?.role === 'admin' && (
                      <>
                        <Link to="/admin/dashboard" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-blue-500 hover:bg-gray-100'>
                          Admin Dashboard
                        </Link>
                        <Link to="/admin/campaigns" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-blue-500 hover:bg-gray-100'>
                          Manage Campaigns
                        </Link>
                        <Link to="/admin/users" role='menuitem' onClick={() => setIsDropdownOpen(false)} className='block w-full px-4 py-2 text-sm text-blue-500 hover:bg-gray-100'>
                          Manage Users
                        </Link>
                      </>
                    )}

                    <hr className=' border-gray-300' />
                    <button onClick={() => { logout(); setIsDropdownOpen(false); }} role="menuitem" className='w-full px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50'>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/*login and register*/}
              <Link to="/login" className='text-gray-500 hover:text-green-700 px-4 py-2 font-medium'>
                Login
              </Link>
              <Link to="/register" className='border rounded-md bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 font-medium'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
