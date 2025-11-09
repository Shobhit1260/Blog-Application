// @ts-nocheck
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import api from '../utils/api'
import { toast } from 'react-hot-toast'

export default function BlogCard({ post, onDelete }){
  const excerpt = (post.content || '').slice(0, 140)
  const hasMore = (post.content || '').length > 140
  const currentUser = useSelector(selectUser)
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const isAuthor = currentUser && currentUser._id === post.author?._id

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.del(`/blogs/deleteblog/${post._id}`)
      toast.success('Post deleted successfully')
      setShowDeleteModal(false)
      if (onDelete) onDelete(post._id)
      // Optionally reload or navigate
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete post')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
    <motion.article 
      whileHover={{ y: -8, scale: 1.02 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
      className="group bg-white dark:bg-gray-800 rounded-xl card-shadow hover:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
    >
      {/* Delete button for author */}
      {isAuthor && (
        <button
          onClick={(e) => {
            e.preventDefault()
            setShowDeleteModal(true)
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          title="Delete post"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      
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
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author?.username} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  {post.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              )}
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
            </Link>

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

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Delete Post?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{post.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
