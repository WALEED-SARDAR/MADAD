import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchMyCampaigns } from '../../api/campaign'
import { fetchMyDonations } from '../../api/donation'
import toast from 'react-hot-toast'
import CampaignCard from '../../components/ui/CampaignCard'

const Dashboard = () => {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = React.useState([]);
  const [donations, setDonations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonated: 0,
    totalRaised: 0,
    successfulCampaigns: 0
  });

  React.useEffect(() => {
    DashboardData();
  }, []);

  const DashboardData = async () => {
    try {
      const campaignData = await fetchMyCampaigns();
      const donationsData = await fetchMyDonations();
      const fetchedCampaigns = campaignData.campaigns || [];
      const fetchedDonations = donationsData.donations || [];

      setCampaigns(fetchedCampaigns);
      setDonations(fetchedDonations);
      setStats({
        totalCampaigns: fetchedCampaigns.length,
        activeCampaigns: fetchedCampaigns.filter(c => c.status === 'approved').length,
        totalDonated: fetchedDonations.reduce((acc, d) => acc + (d.amount || 0), 0),
        totalRaised: fetchedDonations.reduce((acc, d) => acc + (d.amountRaised || 0), 0),
        successfulCampaigns: fetchedCampaigns.filter(c => c.status === 'successful').length
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch campaigns')
    } finally {
      setLoading(false);
    }
  }

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
      <h1 className="text-3xl font-bold text-green-700">
        Dashboard
      </h1>
      <p className='text-gray-600 italic m-3'>
        Welcome, {user.name || user.email.split('@')[0]}
      </p>

      {/* STATS CARDS */}
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalCampaigns}</div>
          <div className="text-gray-600">Total Campaigns</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.activeCampaigns}</div>
          <div className="text-gray-600">Active Campaigns</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalDonated}</div>
          <div className="text-gray-600">Total Donated</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalRaised}</div>
          <div className="text-gray-600">Total Raised</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.successfulCampaigns}</div>
          <div className="text-gray-600">Successful Campaigns</div>
        </div>
      </div>

      {/* RECENT CAMPAIGNS & RECENT DONATIONS */}
      <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>

        {/* RECENT CAMPAIGNS */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold text-green-700'>Recent Campaigns</h2>
            <Link to="/campaign/my-campaigns" className='text-green-600 hover:underline text-md'>View All</Link>
          </div>
          {campaigns.length === 0 ? (
            <p className='text-gray-600'>No recent campaigns found.</p>
          ) : (
            <ul className='space-y-4'>
              {campaigns.slice(0, 1).map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </ul>
          )}
        </div>

        {/* RECENT DONATIONS */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold text-green-700'>Recent Donations</h2>
            <Link to="/donation/my-donations" className='text-green-600 hover:underline text-md'>View All</Link>
          </div>
          {donations.length === 0 ? (
            <p className='text-gray-600'>No recent donations found.</p>
          ) : (
            <ul className='space-y-4'>
              {donations.slice(0, 1).map((donation) => {
                const campaign = donation.campaign;
                return (
                  <div className='relative' key={donation._id}>
                    <CampaignCard campaign={campaign} />
                    <div className='absolute top-2 right-2 bg-white p-3 rounded-full font-semibold'>
                      <p className='text-md text-green-700'>Donated: {donation.amount}</p>
                      <p className='text-xs text-gray-500'>on {new Date(donation.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                )
              })}
            </ul>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default Dashboard;
