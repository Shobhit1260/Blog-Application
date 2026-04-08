// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import api from '../utils/api'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import DOMPurify from 'dompurify'

export default function BlogDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector(selectUser)
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [commentEmoji, setCommentEmoji] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const EMOJIS = ['😊','👍','🎉','❤️','😂','😮','😢','🔥','🙏','👏']
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/blogs/getblog/${id}`)
        const blogPost = res.data?.blog || res.blog
        setPost(blogPost)
        if (currentUser && blogPost.likes) {
          const hasLiked = blogPost.likes.includes(currentUser._id)
          setLiked(hasLiked)
        }
        setLoading(false)
      } catch (e) {
        console.error(e)
        toast.error('Failed to load post')
        setLoading(false)
      }
    }
    if (id) load()
  }, [id, currentUser])

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Please login to like')
      return
    }
    
    try {
      const res = await api.post(`/blogs/likeblog/${id}`)
      const updatedBlog = res.data?.blog || res.blog
      const isLiked = res.data?.isLiked
      
      setPost(updatedBlog)
      setLiked(isLiked)
      toast.success(isLiked ? '❤️ Liked!' : 'Unliked')
    } catch (e) {
      console.error(e)
      toast.error('Failed to like/unlike')
    }
  }

  const handleShare = async (platform) => {
    const url = window.location.href
    const text = post.title
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
    setShowShareMenu(false)
  }

  const submitComment = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }
    try {
      await api.post(`/blogs/commentblog/${id}`, { comment, emoji: commentEmoji })
      const res = await api.get(`/blogs/getblog/${id}`)
      setPost(res.data?.blog || res.blog)
      setComment('')
      setCommentEmoji('')
      setShowCommentBox(false)
      toast.success('Comment posted!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to post comment')
    }
  }

  const handleDeletePost = async () => {
    setDeleting(true)
    try {
      await api.del(`/blogs/deleteblog/${id}`)
      toast.success('Post deleted successfully')
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete post')
      setDeleting(false)
    }
  }

  const isAuthor = currentUser && post && currentUser._id === post.author?._id

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-cyan-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) return null

  const readingTime = Math.ceil(post.content?.split(' ').length / 200) || 1

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </motion.button>

      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
        >
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-96 object-cover"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {post.categories?.map((cat, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold"
          >
            {cat}
          </span>
        ))}
        {post.tags?.map((tag, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-6 text-balance"
      >
        {post.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700"
      >
        <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-4">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt={post.author?.username} className="w-14 h-14 rounded-full object-cover shadow-lg" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {post.author?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          )}
          <div>
            <div className="font-bold text-lg">{post.author?.username || 'Anonymous'}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3">
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              liked 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <svg className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold">{post.likes?.length || 0}</span>
          </motion.button>

          {isAuthor && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </motion.button>

            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span>Tweet</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span>Copy link</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
      >
        <div
          className="text-lg leading-relaxed text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
        />
      </motion.div>

      <div className="my-12 border-t border-gray-200 dark:border-gray-700"></div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold">Comments ({post.comments ? post.comments.length : 0})</h3>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowCommentBox(!showCommentBox); if (!showComments) setShowComments(true); }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold shadow-lg"
            >
              Write a comment
            </motion.button>
            {showComments ? (
              <button onClick={() => setShowComments(false)} className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium">
                Close comments
              </button>
            ) : (
              <button onClick={() => setShowComments(true)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-medium">
                Show comments
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showCommentBox && showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition resize-none"
              />
              <div className="mt-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitComment}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold"
                >
                  Post Comment
                </motion.button>
                <button
                  onClick={() => {
                    setShowCommentBox(false)
                    setComment('')
                    setCommentEmoji('')
                  }}
                  className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showComments ? (
          <div className="space-y-6">
            {(!post.comments || post.comments.length === 0) ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              post.comments.map((c, idx) => (
                <div key={c._id || idx} className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    {c.user?.avatar ? (
                      <img src={c.user.avatar} alt={c.user?.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {c.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {c.user?.username || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                        {c.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={() => setShowComments(true)} className="px-4 py-2 border rounded-lg">
              Show comments ({post.comments ? post.comments.length : 0})
            </button>
          </div>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </motion.div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !deleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Delete Post?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}