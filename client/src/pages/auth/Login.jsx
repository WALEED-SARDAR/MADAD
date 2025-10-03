import React from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { loginUser } from "../../api/auth";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [showPassword, setShowPassword] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors below");
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const result = await loginUser(formData);
      toast.success(result.message || "Logged in successfully");
      // result may contain token and user info depending on API
      login(result?.user || result, result?.token);
      navigate("/");
    } catch (error) {
      // Check if the error is due to unverified email
      if (error.message === "Email not verified") {
        // Store email in localStorage for OTP verification
        localStorage.setItem('pendingEmail', formData.email);

        // Navigate to OTP verification
        navigate("/verify-email", { state: { email: formData.email } });
        toast.info("Please verify your email to continue");
      } else {
        toast.error(error.message || "Error in logging in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className='w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-100 shadow-lg'>
        <h1 className="text-4xl font-bold mb-2 text-center text-green-700">Login</h1>
        <p className='text-sm text-center mb-8 font-medium italic text-gray-500'>Welcome back! Please enter your details.</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className='font-semibold text-gray-500'>Email</label>
            <input className='w-full p-2 border border-gray-300 rounded-md'
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          {/* Password Field */}
          <div>
            <label htmlFor="password" className='font-semibold text-gray-500'>Password</label>
            <div className='relative'>
              <input className='w-full p-2 pr-10 border border-gray-300 rounded-md'
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>
          <button className='w-full p-2 bg-green-700 text-white rounded-md cursor-pointer' type="submit" disabled={loading}>{loading ? "Logging in.." : "Login"}</button>
        </form>

        <p className='text-sm text-center text-gray-500'>
          Don't have an account?
          <span onClick={() => navigate("/register")} className='text-blue-600 cursor-pointer hover:underline'> Register</span>
        </p>
        <p className='text-sm text-center text-gray-500'>
          Forgot password?
          <span onClick={() => navigate("/forgot-password")} className='text-blue-600 cursor-pointer hover:underline'> Reset Password</span>
        </p>
      </div>
    </div>
  )
}

export default Login
