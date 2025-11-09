// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BlogCard({ post }){
  const excerpt = (post.content || '').slice(0, 140)
  const hasMore = (post.content || '').length > 140

  return (
    <motion.article 
      whileHover={{ y: -8, scale: 1.02 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
      className="group bg-white dark:bg-gray-800 rounded-xl card-shadow hover:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <Link to={`/post/${post._id}`}>
        <div className="overflow-hidden">
          {post.coverImage ? (
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-52 bg-gradient-to-br from-indigo-100 via-purple-50 to-cyan-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-cyan-900/30 flex items-center justify-center">
              <svg className="w-16 h-16 text-indigo-300 dark:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        {/* Category/Tags */}
        {(post.categories || post.tags) && (
          <div className="mb-3 flex items-center gap-2">
            {(post.categories || post.tags || []).slice(0, 2).map((item, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/30 dark:to-cyan-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full tracking-wide uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 text-xl md:text-2xl font-bold leading-tight tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          <Link to={`/post/${post._id}`} className="text-balance">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {excerpt}{hasMore && '...'}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {post.author?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {post.author?.username || 'Anonymous'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Read More */}
          <Link 
            to={`/post/${post._id}`} 
            className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold text-sm group-hover:gap-2.5 transition-all"
          >
            Read
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
