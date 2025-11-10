// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <section className="container my-16 px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-full"
          >
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              ✨ Welcome to Blogger
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ x:-30, opacity:0 }} 
            animate={{ x:0, opacity:1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-balance"
          >
            Write, read and <span className="font-display bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">share knowledge</span>
          </motion.h1>
          
          <motion.p 
            initial={{ x:-10, opacity:0 }} 
            animate={{ x:0, opacity:1 }} 
            transition={{ delay:0.4 }} 
            className="mt-6 text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 font-light"
          >
            A modern place to publish your ideas. Engaging, minimal and fast — crafted for readers and creators.
          </motion.p>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link 
              to="/create" 
              className="group px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-400 text-white rounded-lg shadow-lg hover:shadow-xl font-semibold text-lg flex items-center gap-2"
            >
              <span>Write a story</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              to="/feed" 
              className="px-6 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-lg transition-colors"
            >
              Explore
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex gap-8"
          >
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">5K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Writers</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Readers</div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden card-shadow transform hover:scale-[1.02] transition-transform duration-300">
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Person reading and writing" 
              className="w-full h-80 md:h-96 object-cover"
            />
          </div>
          
          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">

              <div>
                <div className="font-semibold text-sm">Just Published</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">2 minutes ago</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
