import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { updatePassword, updateProfile } from '../../api/auth';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [updating, setUpdating] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [avatar, setAvatar] = React.useState(null);
  const [avatarPreview, setAvatarPreview] = React.useState(user?.avatar?.url || "");
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const avatarChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    if (avatar) {
      updatedData.append("avatar", avatar);
    }
    try {
      const response = await updateProfile(updatedData);
      toast.success("Profile updated successfully");
      updateUser(response.user);
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setSubmitting(true);
    try {
        await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message || "Password change failed");
    }finally{
      setSubmitting(false);
    }
  };

  return (
    <div className='max-w-7xl mx-32 p-4'>
      <h1 className='text-3xl font-bold mb-2 text-green-700'>Profile Setting</h1>
      <p className='text-md '>Manage your profile settings here.</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>

        {/* Personal Information Section */}
        <div className='p-4 border border-gray-200 rounded-lg shadow-sm'>
          <h2 className='text-xl font-bold mb-2'>Personal Information</h2>

          <form onSubmit={handleProfileUpdate} className='space-y-4'>
            <div>
              {/*avatar upload*/}
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Profile Picture
              </label>
              <div className='flex items-center space-x-4'>
                <div className='relative'>
                  <img src={avatarPreview} alt="Profile" className='w-24 h-24 rounded-full border border-gray-200 object-cover' />
                  <label htmlFor="avatar-upload" className='absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full cursor-pointer hover:bg-gray-700'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input type="file" accept="image/*" onChange={avatarChangeHandler} id='avatar-upload' className='hidden' />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Upload a new profile picture
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
              {/* Full Name and Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mt-4 mb-1'>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                  name="name"
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='John Doe' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mt-4 mb-1'>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='john.doe@example.com' />
              </div>
              <button
                type="submit"
                disabled={updating}
                className='mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'>
                {updating ? "updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className='p-4 border border-gray-200 rounded-lg shadow-sm'>
          <h2 className='text-xl font-bold mb-2'>Change Password</h2>
          <form onSubmit={handleChangePassword} className='space-y-4'>
            <div>
              <label htmlFor="current-password" className='block text-sm font-medium text-gray-700 mb-1'>
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                id='current-password'
                className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Enter Your Password' />
            </div>
            <div>
              <label htmlFor="new-password" className='block text-sm font-medium text-gray-700 mb-1'>
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                id='new-password'
                className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Enter Your Password' />
            </div>
            <div>
              <label htmlFor="confirm-password" className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                id='confirm-password'
                className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Enter Your Password' />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className='mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'>
              {submitting ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
