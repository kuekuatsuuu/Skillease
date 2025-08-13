'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Chrome, Sun, Moon } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Google login failed:', error)
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-cover bg-center relative animate-fadeIn ${
        isDarkMode ? 'bg-gray-950' : 'bg-gray-100'
      }`}
      style={{
        backgroundImage: "url('/mountains.jpg')",
      }}
    >
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/30'} z-0`} />

      <div className={`relative z-10 max-w-md w-full p-8 rounded-2xl backdrop-blur-2xl ${
        isDarkMode 
          ? 'bg-black/30 border-white/10' 
          : 'bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl'
      } border ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-slideUp`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-center animate-fadeInSlide">
            SkilLease
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200/30 transition"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
              <Moon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        <p className={`text-center text-sm mb-6 ${
          isDarkMode ? 'text-white/70' : 'text-gray-600'
        } animate-fadeInSlide`}>
          Sign in to your SkilLease account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-sm font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-3 ${
                isDarkMode ? 'text-white/60' : 'text-gray-500'
              } h-5 w-5`} />
              <input
                type="email"
                required
                className={`w-full py-2.5 pl-10 pr-4 ${
                  isDarkMode
                    ? 'bg-white/5 text-white border-white/10 placeholder-white/50'
                    : 'bg-white/30 text-gray-900 border-white/40 placeholder-gray-400 backdrop-blur-md'
                } rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-semibold block mb-1">Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-3 ${
                isDarkMode ? 'text-white/60' : 'text-gray-500'
              } h-5 w-5`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`w-full py-2.5 pl-10 pr-10 ${
                  isDarkMode
                    ? 'bg-white/5 text-white border-white/10 placeholder-white/50'
                    : 'bg-white/30 text-gray-900 border-white/40 placeholder-gray-400 backdrop-blur-md'
                } rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={`absolute right-3 top-3 ${
                  isDarkMode ? 'text-white/60' : 'text-gray-500'
                }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${
              isDarkMode
                ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white'
                : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white'
            } font-semibold rounded-lg shadow-lg transition duration-300 hover:scale-105 disabled:animate-pulse`}
          >
            {loading ? '⏳ Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className={`w-1/4 border-t ${
            isDarkMode ? 'border-white/10' : 'border-white/40'
          }`} />
          <span className={`mx-4 text-sm ${
            isDarkMode ? 'text-white/60' : 'text-gray-500'
          }`}>Or continue with</span>
          <span className={`w-1/4 border-t ${
            isDarkMode ? 'border-white/10' : 'border-white/40'
          }`} />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 ${
            isDarkMode
              ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              : 'bg-white/30 border-white/40 text-gray-900 hover:bg-white/40 backdrop-blur-md'
          } border rounded-lg transition hover:scale-105`}
        >
          <Chrome className={`h-5 w-5 ${isDarkMode ? 'text-teal-300' : 'text-teal-600'}`} />
          Sign in with Google
        </button>

        {/* Footer Links */}
        <div className={`mt-6 text-center text-sm ${
          isDarkMode ? 'text-white/70' : 'text-gray-600'
        }`}>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-teal-300 hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2">
            <Link href="#" className="hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }

        @keyframes fadeInSlide {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.6s ease-out;
        }

        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounceOnce {
          animation: bounceOnce 0.3s ease-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </div>
  )
}