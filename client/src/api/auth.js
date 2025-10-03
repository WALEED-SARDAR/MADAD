import api from "./index";

//Register User
export const registerUser = async (formData) => {
    try {
        const response = await api.post("/auth/register", formData);
        return response.data;        
    } catch (error) {
        // Fix: Properly extract error message from response
        const errorMessage = error.response?.data?.message || error.message || "Registration failed";
        throw new Error(errorMessage);
    }
};

//Login User
export const loginUser = async (formData) => {
    try {
        const response = await api.post("/auth/login", formData);
        if(response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        // Fix: Properly extract error message from response
        const errorMessage = error.response?.data?.message || error.message || "Login failed";
        throw new Error(errorMessage);
    }
};

//Verify Email OTP
export const verifyEmail = async (formData) => {
    try {
        const response = await api.post("/auth/verify-email", formData);
        if(response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Email verification failed";
        throw new Error(errorMessage);
    }
};

//Resend OTP
export const resendOTP = async (formData) => {
    try {
        const response = await api.post("/auth/resend-otp", formData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to resend OTP";
        throw new Error(errorMessage);
    }
};

//Logout User
export const logoutUser = async () => {
    try {
        const response = await api.post("/auth/logout");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Logout failed";
        throw new Error(errorMessage);
    }
};

// Request password reset OTP
export const requestPasswordReset = async (formData) => {
    try {
        const response = await api.post("/auth/password-reset", formData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Password reset request failed";
        throw new Error(errorMessage);
    }
};

// Verify OTP and set new password
export const verifyPasswordReset = async (formData) => {
    try {
        const response = await api.post("/auth/verify-password-reset", formData);
        if(response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Password reset verification failed";
        throw new Error(errorMessage);
    }
};

// Update user profile
export const updateProfile = async (formData) => {
    try {
        const response = await api.put("/user/profile", formData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Profile update failed";
        throw new Error(errorMessage);
    }
};

// Update password
export const updatePassword = async (formData) => {
    try {
        const response = await api.put("/user/password", formData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Password update failed";
        throw new Error(errorMessage);
    }
};