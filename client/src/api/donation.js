import api from './index';

export const fetchMyDonations = async () => {
  try {
    const response = await api.get('/donation/my-donations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchCampaignDonations = async (campaignId) => {
  try {
    const response = await api.get(`/donation/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchAllDonations = async () => {
  try {
    const response = await api.get('/donation/campaigns');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCheckoutSession = async (donationData) => {
  try {
    const response = await api.post('/donation/create-checkout-session', donationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyCheckoutSession = async (sessionId) => {
  try {
    const response = await api.post('/donation/verify-checkout-session', { sessionId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
