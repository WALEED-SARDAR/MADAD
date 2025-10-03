import React from 'react'
import CampaignCard from '../../components/ui/CampaignCard'
import { fetchAllCampaigns } from '../../api/campaign'
import toast from 'react-hot-toast';

const AllCampaigns = () => {
  const [campaigns, setCampaigns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllCampaigns();
        setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
      } catch (error) {
        toast.error("Failed to fetch campaigns");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-green-700">Donation Campaigns: {campaigns.length}</h1>
      <p className='text-gray-600 italic m-3'>
        Explore our various donation campaigns and contribute to a cause you care about.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through your campaigns data and render a CampaignCard for each */}
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>

    </div>
  )
};

export default AllCampaigns;


