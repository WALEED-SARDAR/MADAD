import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { requestPasswordReset, verifyPasswordReset } from '../../api/auth'

const ForgetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || localStorage.getItem('pendingEmail') || '';
  const [step, setStep] = React.useState(initialEmail ? 2 : 1);
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = React.useState(initialEmail);
  const [otp, setOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordReset({ email });
      toast.success(res.message || 'OTP sent to your email');
      localStorage.setItem('pendingEmail', email);
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Missing email');
      return;
    }
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyPasswordReset({ email, otp, newPassword });
      toast.success(res.message || 'Password reset successful');
      localStorage.removeItem('pendingEmail');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className='w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-100 shadow-lg'>
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          {step === 1 ? 'Forgot Password' : 'Verify OTP & Set New Password'}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleRequest} className='space-y-4'>
            <div>
              <label htmlFor="email" className='font-semibold text-gray-500'>Email</label>
              <input
                className='w-full p-2 border border-gray-300 rounded-md'
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className='w-full p-2 bg-green-700 text-white rounded-md cursor-pointer' type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className='space-y-4'>
            <div>
              <label className='font-semibold text-gray-500'>Email</label>
              <input
                className='w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600'
                type="email"
                value={email}
                disabled
                readOnly
              />
            </div>
            <div>
              <label htmlFor="otp" className='font-semibold text-gray-500'>OTP</label>
              <input
                className='w-full p-2 border border-gray-300 rounded-md'
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className='font-semibold text-gray-500'>New Password</label>
              <input
                className='w-full p-2 border border-gray-300 rounded-md'
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className='font-semibold text-gray-500'>Confirm Password</label>
              <input
                className='w-full p-2 border border-gray-300 rounded-md'
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className='w-full p-2 bg-green-700 text-white rounded-md cursor-pointer' type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Reset Password'}
            </button>
            <button
              type="button"
              className='w-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md cursor-pointer'
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgetPassword
