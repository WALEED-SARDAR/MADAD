import api from "./index";

// Create campaign
export const createCampaign = async (formData) => {
    try {
        // formData should be a FormData instance containing fields and optional file under 'image'
        const response = await api.post('/campaign/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create campaign';
        throw new Error(errorMessage);
    }
};

// Fetch all campaigns
export const fetchAllCampaigns = async () => {
    try {
        const response = await api.get('/campaign/all');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns';
        throw new Error(errorMessage);
    }
};

// Fetch single campaign by ID
export const fetchCampaignById = async (campaignId) => {
    try {
        const response = await api.get(`/campaign/${campaignId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign';
        throw new Error(errorMessage);
    }
};

// Fetch my campaigns
export const fetchMyCampaigns = async () => {
    try {
        const response = await api.get('/campaign/my-campaigns');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch your campaigns';
        throw new Error(errorMessage);
    }
}