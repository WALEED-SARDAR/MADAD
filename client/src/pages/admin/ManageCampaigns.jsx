import React, { useState, useEffect } from 'react'
import { fetchAllCampaigns, approveCampaign, rejectCampaign, blockUnblockCampaign } from '../../api/admin'
import CampaignCard from '../../components/ui/CampaignCard'
import { toast } from 'react-hot-toast'

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetchAllCampaigns()
      if (response.success && Array.isArray(response.campaigns)) {
        setCampaigns(response.campaigns)
        if (response.campaigns.length === 0) {
          toast.info('No campaigns found')
        }
      } else {
        setCampaigns([])
        toast.error('Error loading campaigns')
      }
      setLoading(false)
    } catch (error) {
      console.error('Campaign fetch error:', error)
      toast.error(error.message || 'Error fetching campaigns')
      setCampaigns([])
      setLoading(false)
    }
  }

  const handleApprove = async (campaignId) => {
    try {
      setActionLoading(prev => ({ ...prev, [campaignId]: 'approve' }))
      const response = await approveCampaign(campaignId)
      toast.success(response.message || 'Campaign approved successfully')
      await fetchCampaigns()
    } catch (error) {
      toast.error(error.message || 'Error approving campaign')
    } finally {
      setActionLoading(prev => ({ ...prev, [campaignId]: null }))
    }
  }

  const handleReject = async (campaignId) => {
    try {
      setActionLoading(prev => ({ ...prev, [campaignId]: 'reject' }))
      const response = await rejectCampaign(campaignId)
      toast.success(response.message || 'Campaign rejected successfully')
      await fetchCampaigns()
    } catch (error) {
      toast.error(error.message || 'Error rejecting campaign')
    } finally {
      setActionLoading(prev => ({ ...prev, [campaignId]: null }))
    }
  }

  const handleBlockUnblock = async (campaignId) => {
    try {
      setActionLoading(prev => ({ ...prev, [campaignId]: 'block' }))
      const response = await blockUnblockCampaign(campaignId)
      if (response.success && response.campaign) {
        toast.success(response.message)
        await fetchCampaigns()
      } else {
        throw new Error('Failed to update campaign status')
      }
    } catch (error) {
      toast.error(error.message || 'Error updating campaign status')
      console.error('Block/Unblock error:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [campaignId]: null }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-green-700 font-bold mb-8">Manage Campaigns</h1>
      {campaigns.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No campaigns found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="relative">
              <CampaignCard campaign={campaign} />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {campaign.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(campaign._id)}
                      disabled={actionLoading[campaign._id]}
                      className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {actionLoading[campaign._id] === 'approve' ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Approving...
                        </span>
                      ) : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(campaign._id)}
                      disabled={actionLoading[campaign._id]}
                      className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {actionLoading[campaign._id] === 'reject' ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Rejecting...
                        </span>
                      ) : 'Reject'}
                    </button>
                  </>
                ) : campaign.status === 'rejected' ? (
                    null
                ) : (
                   <button
                    onClick={() => handleBlockUnblock(campaign._id)}
                    disabled={actionLoading[campaign._id]}
                    className={`${
                      campaign.status === 'blocked' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                    } text-white px-4 py-2 rounded-md w-full disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {actionLoading[campaign._id] === 'block' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {campaign.status === 'blocked' ? 'Unblocking...' : 'Blocking...'}
                      </span>
                    ) : (campaign.status === 'blocked' ? 'Unblock' : 'Block')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageCampaigns
