import React from "react"
import { Routes, Route } from "react-router-dom"
import AuthRoute from "./AuthRoute"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoutes from "./AdminRoutes"

import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import OTPVerification from "../pages/auth/OTPVerification"
import ForgetPassword from "../pages/auth/ForgetPassword"

import Campaigns from "../pages/campaigns/AllCampaigns"
import CreateCampaign from "../pages/campaigns/CreateCampaign"
import CampaignDetail from "../pages/campaigns/CampaignDetail"
import MyCampaigns from "../pages/campaigns/MyCampaigns"
import DonationSuccess from "../pages/donations/DonationSuccess"
import MyDonations from "../pages/donations/MyDonations"

import Dashboard from "../pages/user/Dashboard"
import Profile from "../pages/user/Profile"

import AdminDashboard from "../pages/admin/Dashboard"
import ManageUsers from "../pages/admin/ManageUsers"
import ManageCampaigns from "../pages/admin/ManageCampaigns"

function AppRoutes() {
    return (
        <Routes>
            {/* Home Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/verify-email" element={<AuthRoute><OTPVerification /></AuthRoute>} />
            <Route path="/forgot-password" element={<AuthRoute><ForgetPassword /></AuthRoute>} />

            {/* Campaign Routes */}
            <Route path="/campaign/all" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
            <Route path="/campaign/create" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
            <Route path="/campaign/my-campaigns" element={<ProtectedRoute><MyCampaigns /></ProtectedRoute>} />
            <Route path="/campaign/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
            <Route path="/donation/success" element={<ProtectedRoute><DonationSuccess /></ProtectedRoute>} />
            <Route path="/donation/my-donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />

            {/* User Routes */}
            <Route path="/user/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoutes><AdminDashboard /></AdminRoutes>} />
            <Route path="/admin/users" element={<AdminRoutes><ManageUsers /></AdminRoutes>} />
            <Route path="/admin/campaigns" element={<AdminRoutes><ManageCampaigns /></AdminRoutes>} />

        </Routes>
    )
}

export default AppRoutes