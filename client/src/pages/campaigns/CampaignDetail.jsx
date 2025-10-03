import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCampaignById } from '../../api/campaign';
import DonationForm from '../../components/ui/DonationForm';
import { fetchCampaignDonations } from '../../api/donation';

const statusColors = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  blocked: 'bg-gray-200 text-gray-700',
};

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First fetch campaign data
        const campaignData = await fetchCampaignById(id);
        setCampaign(campaignData.campaign);

        // Only fetch donations if we have a valid campaign
        if (campaignData.campaign) {
          const donationsData = await fetchCampaignDonations(id);
          setDonations(donationsData.donations);
        }
      } catch (err) {
        setError(err.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Status badge
  const statusBadge = campaign ? (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[campaign.status] || 'bg-gray-100 text-gray-700'}`}>
      {campaign.status?.toUpperCase()}
    </span>
  ) : null;

  // Tags (category)
  const tags = campaign?.category ? (
    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold mr-2">
      {campaign.category}
    </span>
  ) : null;

  // Progress
  const goal = campaign?.goalAmount || 0;
  const raised = campaign?.raisedAmount || 0;
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  //Donation formatting
  const isEnded = campaign?.deadline ? new Date(campaign.deadline) < new Date() : false;
  const isApproved = campaign?.status === 'approved';
  const canDonate = isApproved && !isEnded;


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center py-12">{error}</div>;
  }
  if (!campaign) {
    return <div className="text-gray-600 text-center py-12">Campaign not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">

      {/** Campaign Details */}
      <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        <img
          src={campaign.image?.url || '/placeholder-campaign.svg'}
          alt={campaign.title}
          className="w-full h-74 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-green-700">{campaign.title}</h1>
            {tags} {statusBadge}
          </div>
          <div className="m-4">
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div className="h-3 bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-700">Raised: <span className="font-bold">{raised}</span></span>
              <span className="text-gray-700">Goal: <span className="font-bold">{goal}</span></span>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center justify-between mb-4">
            <div className='flex items-center'>
              <img
                src={campaign.creator?.avatar?.url || '/placeholder-avatar.svg'}
                alt={campaign.creator?.name || 'Anonymous'}
                className="w-12 h-12 rounded-full object-cover mr-3 border"
              />
              <div>
                <div className="text-gray-800 font-semibold">{campaign.creator?.name || 'Anonymous'}</div>
                <div className="text-xs text-gray-500">{campaign.creator?.email || ''}</div>
              </div>
            </div>
            <div>
              <div className='text-gray-400 text-sm'>Created: {formatDate(campaign.createdAt)}</div>
              <div className="text-gray-400 text-sm">Deadline: {formatDate(campaign.deadline)}</div>
            </div>
          </div>

          {/* Campaign Description */}
          <div className="mb-6 text-gray-700 break-words">
            {campaign.description || 'No description provided.'}
          </div>
        </div>
      </div>

      {/** Donation Form */}
      <div className='mt-8 bg-gray-100 p-6 rounded-lg shadow-md'>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Make a Donation</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

          {/*donation list*/}
          <div>
            <h2 className='text-lg font-bold text-gray-800 mb-2'>Recent Donations</h2>
            {donations.length === 0 ? (
              <div className="text-gray-600">No donations yet. Be the first to donate!</div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 bg-white p-3 rounded">
                {donations.map((donation) => (
                  <div key={donation._id} className="mb-4 p-3 bg-gray-100 rounded shadow-sm">
                    <div className="flex items-center justify-between">

                      <div className='flex items-center'>
                        <img
                          src={donation.donor.avatar?.url || '/placeholder-avatar.svg'}
                          alt={donation.donor.name}
                          className="w-10 h-10 rounded-full object-cover mr-3 border"
                        />
                        <div>
                          <div className="text-gray-800 font-semibold">{donation.donor.name || 'Anonymous'}</div>
                          <div className="text-xs text-gray-500">{formatDate(donation.createdAt)}</div>
                        </div>
                      </div>

                      <span className="text-gray-700">{(donation.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/*donation form*/}
          <div>
            {canDonate ? (
              <DonationForm campaignId={campaign._id} minimumAmount={200} />
            ) : (
              <div className="bg-gray-100 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Campaign Ended
                </h3>
                <p className="text-gray-600">
                  This campaign has ended and is no longer accepting donations.
                </p>
              </div>
            ) }
          </div>

        </div>

      </div>


    </div>
  );
}

export default CampaignDetail;
