// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { selectUser, selectIsLoggedIn } from '../store/store'
import { initializeUser, clearUser } from '../store/userSlice'

export default function Header(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Initialize user from localStorage on component mount
    dispatch(initializeUser())
  }, [dispatch])

  // Debug: Log user changes
  useEffect(() => {
    console.log('Header - User updated:', user)
  }, [user])

  const handleLogout = async () => {
    try {
      await api.post('/users/logout')
      dispatch(clearUser())
      toast.success('Logged out successfully')
      navigate('/')
    } catch (err) {
      console.error(err)
      // Clear state anyway
      dispatch(clearUser())
      navigate('/')
    }
  }

  return (
    <motion.header 
      initial={{ y:-20, opacity:0 }} 
      animate={{ y:0, opacity:1 }} 
      className="glass sticky top-4 z-40 mx-4 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80"
    >
      <div className="container px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-shadow"
            >
              <span className="text-xl">✍️</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Blogger
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">Share Your Story</span>
            </div>
          </Link>
          <div className="hidden lg:block">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
              <div className="relative flex items-center">
                <svg className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  aria-label="search" 
                  placeholder="Search stories, tags or authors..." 
                  className="pl-10 pr-4 py-2.5 w-80 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <motion.div whileHover={{ y: -2 }} className="relative group">
            <Link 
              to="/" 
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50"
            >
              Discover
            </Link>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }} className="relative group">
            <Link 
              to="/feed" 
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50"
            >
              Feed
            </Link>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </motion.div>
          
          {isLoggedIn && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/create" 
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Write Story
              </Link>
            </motion.div>
          )}

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all shadow-sm hover:shadow-md"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-gray-800 shadow-lg">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <motion.svg 
                    animate={{ rotate: showUserMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-gray-600 dark:text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", duration: 0.3 }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800">
                        <div className="flex items-center gap-3">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-md" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold ring-2 ring-white dark:ring-gray-700 shadow-md">
                              {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <motion.div whileHover={{ x: 4 }}>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span>My Profile</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div whileHover={{ x: 4 }}>
                          <Link
                            to="/my-posts"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span>My Posts</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div whileHover={{ x: 4 }}>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span>Settings</span>
                          </Link>
                        </motion.div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            setShowUserMenu(false)
                            handleLogout()
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all font-semibold overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
