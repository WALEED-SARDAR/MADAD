import api from "./index";

//FETCH ALL USERS
export const fetchAllUsers = async () => {
  try {
    const { data } = await api.get('/admin/users');
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch users');
    }
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
    throw new Error(errorMessage);
  }
};

//BLOCK/UNBLOCK USER
export const blockUnblockUser = async (userId) => {
  try {
    const { data } = await api.put(`/admin/users/${userId}/block`);
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to block/unblock user';
    throw new Error(errorMessage);
  }
};

//DELETE USER
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
    throw new Error(errorMessage);
  }
};

//FETCH ALL CAMPAIGNS
export const fetchAllCampaigns = async () => {
    try {
        const response = await api.get('/admin/campaigns');
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch campaigns');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns';
        throw new Error(errorMessage);
    }
};

//APPROVE CAMPAIGN
export const approveCampaign = async (campaignId) => {
    try {
        const response = await api.put(`/admin/campaigns/${campaignId}/approve`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to approve campaign');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to approve campaign';
        throw new Error(errorMessage);
    }
};

//REJECT CAMPAIGN
export const rejectCampaign = async (campaignId) => {
    try {
        const response = await api.put(`/admin/campaigns/${campaignId}/reject`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to reject campaign');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to reject campaign';
        throw new Error(errorMessage);
    }
};

//BLOCK/UNBLOCK CAMPAIGN
export const blockUnblockCampaign = async (campaignId) => {
    try {
        const response = await api.put(`/admin/campaigns/${campaignId}/block`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to block/unblock campaign');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to block/unblock campaign';
        throw new Error(errorMessage);
    }
};
