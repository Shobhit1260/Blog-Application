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
      className="page-surface sticky top-4 z-40 mx-4 rounded-2xl"
    >
      <div className="container py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-700 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow"
            >
              <span className="text-xl">B</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Blogger
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium -mt-1">Calm writing space</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-teal-500"></span>
            <span>Read, write, and publish with less noise</span>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3">
          <motion.div whileHover={{ y: -2 }} className="relative group">
            <Link 
              to="/" 
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-colors rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            >
              Discover
            </Link>
            <div className="absolute bottom-0 left-4 right-4 h-px bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </motion.div>
          
          {isLoggedIn && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/create" 
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full shadow-sm hover:shadow-md transition-all font-semibold"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 hover:border-teal-500 transition-all shadow-sm hover:shadow-md"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-gray-800 shadow-lg">
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
                      className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                        <div className="flex items-center gap-3">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-md" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white text-lg font-bold ring-2 ring-white dark:ring-gray-700 shadow-md">
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
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-sky-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                className="relative px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full shadow-sm hover:shadow-md transition-all font-semibold overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in
                </span>
                <div className="absolute inset-0 bg-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
