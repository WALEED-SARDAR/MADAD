import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { verifyEmail, resendOTP } from "../../api/auth";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('pendingEmail') || '';
  
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  // Countdown timer for resend button
  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no email found
  React.useEffect(() => {
    if (!email) {
      toast.error("No email found. Please register or login again.");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmail({ email, otp });
      toast.success(result.message || "Email verified successfully!");
      
      // Clear pending email from localStorage
      localStorage.removeItem('pendingEmail');
      
      // Store token if provided
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      
      // Navigate to home page
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    try {
      await resendOTP({ email });
      toast.success("OTP resent successfully!");
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className='w-full max-w-md p-8 space-y-6 rounded-xl bg-gray-100 shadow-lg'>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-green-700">Verify Your Email</h1>
          <p className="text-gray-600 mb-4">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-gray-800">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor="otp" className='block font-semibold text-gray-500 mb-2'>
              Enter Verification Code
            </label>
            <input 
              className='w-full p-3 border border-gray-300 rounded-md text-center text-2xl font-mono tracking-widest' 
              type="text" 
              name="otp" 
              id="otp"
              autoComplete="one-time-code"
              placeholder="000000" 
              value={otp} 
              onChange={handleOtpChange}
              maxLength={6}
              required 
            />
          </div>
          
          <button 
            className='w-full p-3 bg-green-700 text-white rounded-md cursor-pointer hover:bg-green-800 transition-colors' 
            type="submit" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">
            Didn't receive the code?
          </p>
          
          <button
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${
              countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {resendLoading 
              ? "Sending..." 
              : countdown > 0 
                ? `Resend in ${countdown}s` 
                : "Resend OTP"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
