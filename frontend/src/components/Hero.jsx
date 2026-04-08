// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <section className="container my-12 lg:my-16">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-teal-200/70 bg-teal-50/80 text-teal-800 dark:border-teal-900/40 dark:bg-teal-900/20 dark:text-teal-200"
          >
            <span className="h-2 w-2 rounded-full bg-teal-500"></span>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase">Welcome to Blogger</span>
          </motion.div>
          
          <motion.h1 
            initial={{ x:-30, opacity:0 }} 
            animate={{ x:0, opacity:1 }}
            transition={{ delay: 0.3 }}
            className="section-heading text-4xl md:text-5xl lg:text-6xl text-balance text-slate-950 dark:text-white"
          >
            Write, read, and share ideas with room to breathe.
          </motion.h1>
          
          <motion.p 
            initial={{ x:-10, opacity:0 }} 
            animate={{ x:0, opacity:1 }} 
            transition={{ delay:0.4 }} 
            className="mt-6 text-lg md:text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-xl"
          >
            A calm publishing surface for long-form writing, designed to feel focused, readable, and quietly modern.
          </motion.p>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link 
              to="/create" 
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm hover:shadow-md"
            >
              <span>Write a story</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-200 bg-white/80 text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
              Browse posts
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-xl"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">10K+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Stories</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">5K+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Writers</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">50K+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Readers</div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-[2rem] overflow-hidden page-surface-strong transform hover:scale-[1.01] transition-transform duration-300">
            <img 
              src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Person reading and writing" 
              className="w-full h-[22rem] lg:h-[30rem] object-cover"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-5 left-5 sm:left-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">01</div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">Just published</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">2 minutes ago</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
