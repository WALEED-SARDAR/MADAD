import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { verifyCheckoutSession } from "../../api/donation";


const DonationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [donation, setDonation] = React.useState(null);

  const sessionId = searchParams.get("session_id");
  const campaignId = searchParams.get("campaign_id");

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        toast.error("Session ID is missing in the URL");
        setLoading(false);
        return;
      }

      try {
        const response = await verifyCheckoutSession(sessionId);
        if (response.success) {
          setDonation(response.donation);
          toast.success("Donation verified successfully");
        } else {
          toast.error(response.message || "Failed to verify donation session");
        }
      } catch (error) {
        toast.error("Failed to verify donation session");
        console.error("Error verifying session:", error);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center mx-4">
        {/*Success Info*/}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className='text-2xl font-semibold text-green-600 mb-2'>Thank You!</h2>
        <p className='text-gray-800 mb-6'>
          Your Donation of {donation?.amount} PKR to{" "}
          <span className='font-semibold text-green-700'>{donation?.campaign?.title}</span> was Successful.
        </p>

        {/* Buttons Info */}
        <div className="space-y-3">
          <button onClick={() => navigate(`/campaign/${campaignId}`)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-md transition duration-200">
            Go Back to Campaign
          </button>
          <button onClick={() => navigate('/donation/my-donations')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md transition duration-200">
            Go to My Donations
          </button>
          <button onClick={() => navigate('/campaign/all')} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 px-4 rounded-md transition duration-200">
            Explore More Campaigns
          </button>
        </div>
      </div>

    </div>
  )
}

export default DonationSuccess
