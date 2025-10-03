import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const CampaignCard = ({ campaign }) => {
   const { User } = useAuth();


  // Validate campaign prop
  if (!campaign) {
    return null; // or return a placeholder/loading state
  }

  // Fallbacks for missing data
  const imageUrl = campaign?.image?.url || '/placeholder-campaign.svg';
  const title = campaign?.title || 'Untitled Campaign';
  const description = campaign?.description || 'No description available.';
  const goal = campaign?.goalAmount || campaign?.goal || 0;
  const raised = campaign?.amountRaised || campaign?.raisedAmount || 0;
  const deadline = campaign?.deadline || campaign?.endDate || '';

  const statusColors = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  blocked: 'bg-gray-200 text-gray-700',
};

 // Status badge
  const statusBadge = campaign ? (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[campaign.status] || 'bg-gray-100 text-gray-700'}`}>
      {campaign.status?.toUpperCase()}
    </span>
  ) : null;


  // Handle creator info safely
  const creator = campaign?.creator || {};
  const creatorName = creator?.name || campaign?.creatorName || 'Anonymous';
  const creatorAvatar = creator?.avatar?.url || '/placeholder-avatar.svg';

  // Date formatting
  const createdAt = campaign?.createdAt;
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border flex flex-col" >
      <Link to={`/campaign/${campaign?._id || ''}`} className="block cursor-pointer relative"> 
        <img
          src={imageUrl}
          alt={title}
          loading='lazy'
          className="w-full h-50 object-cover"
        />
        <div className="absolute top-4 left-4">
        {statusBadge}
      </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">{description}</p>
        <div className="mb-2">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-700">Raised: {raised}</span>
            <span className="text-gray-700">Goal: {goal}</span>
          </div>
        </div>
        <div className="flex justify-center items-center text-sm text-red-800 mb-2">
          <span>Ends {new Date(deadline).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Creator info */}
        <div className="flex items-center mt-2">
          <img src={creatorAvatar} alt={creatorName} loading='lazy' className="w-7 h-7 rounded-full object-cover mr-2" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">Created by {creatorName}</span>
            <span className="text-xs text-gray-500">Created on {new Date(createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

       <div className="flex justify-center items-center mt-4">
          <Link to={`/campaign/${campaign?._id || ''}`} className="bg-blue-500 text-white text-center w-full p-2 rounded-md hover:bg-blue-600">
            View Details
          </Link>
        </div>


      </div>
    </div>
  );
};

export default CampaignCard;
