'use client'
jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowLeft, Sun, Moon } from 'lucide-react'
import { jsx } from 'react/jsx-runtime'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [userOverride, setUserOverride] = useState(false) // Track manual theme changes
  const { signUp } = useAuth()
  const router = useRouter()

  // Detect system theme and listen for changes
  useEffect(() => {
    // Check initial system theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e) => {
      if (!userOverride) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleThemeChange)
    return () => mediaQuery.removeEventListener('change', handleThemeChange)
  }, [userOverride])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }
    
    try {
      setLoading(true)
      console.log('Attempting signup with:', email, userType)
      
      const result = await signUp(email, password, {
        full_name: fullName,
        user_type: userType
      })
      
      console.log('Signup result:', result)
      
      if (result?.user) {
        if (userType === 'provider') {
          router.push('/provider-dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        throw new Error('No user data returned from signup')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      alert(`Signup failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    setUserOverride(true) // Mark that user has manually changed the theme
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-cover bg-center relative animate-fadeIn ${
        isDarkMode ? 'bg-gray-950' : 'bg-gray-100'
      } overflow-hidden`}
      style={{
        backgroundImage: "url('/mountains.jpg')",
      }}
    >
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/30'} z-0`} />

      <div className={`relative z-10 max-w-3xl w-full p-6 rounded-2xl backdrop-blur-2xl ${
        isDarkMode 
          ? 'bg-black/30 border-white/10 text-white' 
          : 'bg-white/20 border-white/30 shadow-lg backdrop-blur-3xl text-gray-900'
      } animate-slideUp`}>
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <button
              className={`flex items-center px-2 py-0.5 text-xs rounded-lg ${
                isDarkMode 
                  ? 'bg-white/10 text-white/70 hover:bg-white/20 border-white/20'
                  : 'bg-white/30 text-gray-600 hover:bg-white/40 border-white/40'
              } border transition animate-fadeInSlide`}
              aria-label="Go back to home"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </button>
          </Link>
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-full ${
              isDarkMode ? 'hover:bg-white/20' : 'hover:bg-gray-200/30'
            } transition`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold animate-fadeInSlide">
            Join SkilLease
          </h2>
          <p className={`text-xs mt-1 ${
            isDarkMode ? 'text-white/70' : 'text-gray-600'
          } animate-fadeInSlide`}>
            Create your account and start connecting with local services
          </p>
        </div>

        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/30 backdrop-blur-md'
        } border animate-slideUp`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${
                isDarkMode ? 'text-white/90' : 'text-gray-700'
              }`}>
                I want to:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`flex-1 p-2 rounded-xl border transition-all duration-300 ${
                    userType === 'customer'
                      ? isDarkMode
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                        : 'border-teal-500 bg-teal-50 text-teal-700'
                      : isDarkMode
                        ? 'border-white/20 hover:border-white/30 bg-white/5'
                        : 'border-white/40 hover:border-white/50 bg-white/20'
                  } animate-fadeInSlide text-xs`}
                >
                  <User className={`h-4 w-4 mx-auto mb-1 ${
                    userType === 'customer' ? 'text-teal-400' : isDarkMode ? 'text-white/60' : 'text-gray-500'
                  }`} />
                  <div className="font-medium">Find Services</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-white/50' : 'text-gray-500'
                  }`}>Book local services</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('provider')}
                  className={`flex-1 p-2 rounded-xl border transition-all duration-300 ${
                    userType === 'provider'
                      ? isDarkMode
                        ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                        : 'border-purple-500 bg-purple-50 text-purple-700'
                      : isDarkMode
                        ? 'border-white/20 hover:border-white/30 bg-white/5'
                        : 'border-white/40 hover:border-white/50 bg-white/20'
                  } animate-fadeInSlide text-xs`}
                >
                  <Briefcase className={`h-4 w-4 mx-auto mb-1 ${
                    userType === 'provider' ? 'text-purple-400' : isDarkMode ? 'text-white/60' : 'text-gray-500'
                  }`} />
                  <div className="font-medium">Offer Services</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-white/50' : 'text-gray-500'
                  }`}>Provide services</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-2.5 ${
                    isDarkMode ? 'text-white/60' : 'text-gray-500'
                  } h-4 w-4`} />
                  <input
                    type="text"
                    required
                    className={`w-full py-2 pl-10 pr-4 text-xs ${
                      isDarkMode
                        ? 'bg-white/5 text-white border-white/10 placeholder-white/50'
                        : 'bg-white/30 text-gray-900 border-white/40 placeholder-gray-400 backdrop-blur-md'
                    } rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce`}
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-2.5 ${
                    isDarkMode ? 'text-white/60' : 'text-gray-500'
                  } h-4 w-4`} />
                  <input
                    type="email"
                    required
                    className={`w-full py-2 pl-10 pr-4 text-xs ${
                      isDarkMode
                        ? 'bg-white/5 text-white border-white/10 placeholder-white/50'
                        : 'bg-white/30 text-gray-900 border-white/40 placeholder-gray-400 backdrop-blur-md'
                    } rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-2.5 ${
                    isDarkMode ? 'text-white/60' : 'text-gray-500'
                  } h-4 w-4`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    className={`w-full py-2 pl-10 pr-10 text-xs ${
                      isDarkMode
                        ? 'bg-white/5 text-white border-white/10 placeholder-white/50'
                        : 'bg-white/30 text-gray-900 border-white/40 placeholder-gray-400 backdrop-blur-md'
                    } rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce`}
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-2.5 ${
                      isDarkMode ? 'text-white/60' : 'text-gray-500'
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-2.5 ${
                    isDarkMode ? 'text-white/60' : 'text-gray-500'
                  } h-4 w-4`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full py-2 pl-10 pr-4 text-xs ${
                      isDarkMode
                        ? 'bg-white/5 text-white border-white/10 placeholder-white/50'
                        : 'bg-white/30 text-gray-900 border-white/40 placeholder-gray-400 backdrop-blur-md'
                    } rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:animate-bounceOnce`}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white'
              } font-semibold rounded-lg shadow-lg transition duration-300 hover:scale-105 disabled:animate-pulse animate-fadeInSlide text-sm`}
            >
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className={`mt-4 p-3 rounded-lg ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/20 border-white/30 backdrop-blur-md'
          } border animate-slideUp text-xs`}>
            <p className={`font-medium mb-1 ${
              isDarkMode ? 'text-white/90' : 'text-gray-700'
            }`}>
              {userType === 'provider' ? 'As a Provider, you get:' : 'As a Customer, you get:'}
            </p>
            <ul className={`space-y-0.5 ${
              isDarkMode ? 'text-white/70' : 'text-gray-600'
            }`}>
              {userType === 'provider' ? (
                <>
                  <li>• Professional dashboard to manage bookings</li>
                  <li>• Real-time customer location tracking</li>
                  <li>• Direct navigation to customer locations</li>
                  <li>• Earnings tracking and analytics</li>
                </>
              ) : (
                <>
                  <li>• Browse verified local service providers</li>
                  <li>• Location-based service discovery</li>
                  <li>• Instant booking with real-time updates</li>
                  <li>• Review and rating system</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className={`text-center mt-3 text-xs ${
          isDarkMode ? 'text-white/70' : 'text-gray-600'
        } animate-fadeInSlide`}>
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-teal-300 hover:underline">
              Sign in here
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

        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
