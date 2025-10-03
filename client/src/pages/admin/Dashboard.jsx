import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchAllCampaigns } from '../../api/admin'
import { fetchAllDonations } from '../../api/donation'
import { fetchAllUsers } from '../../api/admin'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    pendingCampaigns: 0,
    successfulCampaigns: 0,
    blockedCampaigns: 0,
    totalDonations: 0,
    totalRaised: 0,
    totalUsers: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignsData = await fetchAllCampaigns();
        const donationsData = await fetchAllDonations();
        const usersData = await fetchAllUsers();

        setStats({
          totalCampaigns: campaignsData.campaigns?.length || 0,
          totalDonations: donationsData?.count || 0,
          totalRaised: donationsData?.donations?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0,
          totalUsers: usersData?.count || 0,
          activeCampaigns: campaignsData.campaigns?.filter(c => c.status === 'approved').length || 0,
          pendingCampaigns: campaignsData.campaigns?.filter(c => c.status === 'pending').length || 0,
          successfulCampaigns: campaignsData.campaigns?.filter(c => c.status === 'successful').length || 0,
          blockedCampaigns: campaignsData.campaigns?.filter(c => c.status === 'blocked').length || 0,
        });

      } catch (error) {
        toast.error(error.message || 'Failed to fetch campaigns')
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700"></div>
      </div>
    );
  }


  return (
    <div className='max-w-7xl mx-auto py-6 px-6'>
      {/* HEADER */}
      <h1 className='text-3xl text-green-700 font-bold'>Admin Dashboard</h1>
      <p className='text-gray-600 mt-2'>Welcome back, {user?.name || 'Admin'}!</p>

      {/* STATS */}
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalCampaigns}</div>
          <div className="text-gray-600">Total Campaigns</div>
        </div>
          <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalRaised}</div>
          <div className="text-gray-600">Total Raised</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalDonations}</div>
          <div className="text-gray-600">Total Donations</div>
        </div>
         <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalUsers}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.activeCampaigns}</div>
          <div className="text-gray-600">Active Campaigns</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.pendingCampaigns}</div>
          <div className="text-gray-600">Pending Campaigns</div>
        </div>
         <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.successfulCampaigns}</div>
          <div className="text-gray-600">Successful Campaigns</div>
        </div>
         <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.blockedCampaigns}</div>
          <div className="text-gray-600">Blocked Campaigns</div>
        </div>
      </div>

      {/*LINKS FOR MANAGEMENTS PAGES*/}
        <div className='mt-8 text-3xl text-green-700'>
          <h2 className="font-bold">Management Links</h2>
        </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        <Link
          to="/admin/campaigns"
          className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">
            Campaign Management
          </h3>
          <p className="text-gray-800">
            Approve, reject, block campaigns - complete management
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-gradient-to-bl from-green-400 to-blue-500 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">
            User Management
          </h3>
          <p className="text-gray-800">
            Manage users and their permissions
          </p>
        </Link>
      </div>


    </div>
  )
}

export default Dashboard
