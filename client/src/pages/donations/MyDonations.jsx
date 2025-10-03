import React from 'react'
import { Link } from 'react-router-dom'
import { fetchMyDonations } from '../../api/donation'
import CampaignCard from '../../components/ui/CampaignCard' 
import {toast} from "react-hot-toast"


const MyDonations = () => {
  const [donations, setDonations] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const getMyDonations = async () => {
      try {
        const data = await fetchMyDonations()
        setDonations(data.donations)
      } catch (error) {
        console.error(error)
        toast.error("Error fetching donations")
        setDonations([])
      } finally {
        setLoading(false)
      }
    }

    getMyDonations()
  }, [])


   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Donations</h1>
        </div>

        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-3">No donations yet</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't made any donations yet. Start supporting campaigns that matter to you.
          </p>
          <div className="space-x-4">
            <Link
              to="/campaign/all"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Campaigns
            </Link>

          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div>
      <div className='max-w-7xl mx-auto p-6'>
        <h2 className='text-3xl font-bold text-green-700'>MY DONATIONS</h2>
        <p className='text-gray-600 text-lg m-2'>Donations made: <span className='font-semibold'>{donations.length}</span></p>
      </div>

      <div className='max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {donations.map((donation) => {
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

      </div>

    </div>
  )
}

export default MyDonations
