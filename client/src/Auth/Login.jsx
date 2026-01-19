import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { refetchUser, api } = useAppContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsLoading(true);

      const res = await api.post("/auth/login", { 
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const { token, user } = res.data;
      console.log("🚀 Logged in user from backend:", user);

      if (token) {
        // Save token first
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // 🔑 Then refetch user data
        await refetchUser(); 

        toast.success("Logged in successfully! 🎉");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/src/assets/heroImage.png')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 px-4 mt-20">
        <div className="max-w-md mx-auto ">
          
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 transform transition-all duration-300 hover:shadow-3xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-700">Sign in to your account to continue your luxury journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
               
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              By signing in, you agree to our{' '}
              <a href="#" className="text-white hover:text-white/90 underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-white hover:text-white/90 underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}