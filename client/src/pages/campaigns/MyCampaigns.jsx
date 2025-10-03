import React from 'react'
import CampaignCard from '../../components/ui/CampaignCard'
import { fetchMyCampaigns } from '../../api/campaign'
import { useAuth } from '../../context/AuthContext'

const MyCampaigns = () => {
    const { user } = useAuth()
    const [campaigns, setCampaigns] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const getMyCampaigns = async () => {
            try {
                const data = await fetchMyCampaigns()
                setCampaigns(data.campaigns)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getMyCampaigns()
    }, [user])


     if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-green-700">My Campaigns: {campaigns.length}</h1>
            <p className='text-gray-600 italic m-3'>
                Here are the campaigns you have created. You can manage and track the progress of your campaigns.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                    <CampaignCard key={campaign._id} campaign={campaign} />
                ))}
            </div>
        </div>
    )
}

export default MyCampaigns
