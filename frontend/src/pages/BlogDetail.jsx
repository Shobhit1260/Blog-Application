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
        // Check if current user has liked this post
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

  // Recursive comment item component
  const CommentItem = ({ comment, depth = 0 }) => {
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [replyEmoji, setReplyEmoji] = useState('')
    const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false)

    const onReplySubmit = async () => {
      await postComment(replyText, comment._id, () => {
        setReplyText('')
        setReplyEmoji('')
        setShowReply(false)
      }, replyEmoji)
    }

    const maxDepth = 4
    const indent = Math.min(depth, maxDepth) * 20
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
        style={{ paddingLeft: `${indent}px` }}
        className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-700 max-w-full overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex-shrink-0">
            {comment.user?.avatar ? (
              <img src={comment.user.avatar} alt={comment.user?.username} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {comment.user?.username || 'Anonymous'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
              {comment.emoji && (
                <span className="mr-3 inline-flex items-center justify-center text-2xl leading-none align-middle">
                  {comment.emoji}
                </span>
              )}
              {comment.comment}
            </p>

            <div className="mt-3 flex items-center gap-3">
              {currentUser && (
                <button onClick={() => setShowReply(!showReply)} className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">
                  Reply
                </button>
              )}
            </div>

            {showReply && (
              <div className="mt-3">
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />

                <div className="flex items-center gap-2 mt-2">
                  <div className="relative">
                    <button onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xl">🙂</button>
                    {showReplyEmojiPicker && (
                      <div className="absolute right-0 bottom-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 grid grid-cols-5 gap-2">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => { setReplyText(prev => prev + e); setReplyEmoji(e); setShowReplyEmojiPicker(false) }} className="px-2 py-1 text-2xl leading-none">{e}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-auto flex gap-2">
                    <button onClick={onReplySubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-md">Reply</button>
                    <button onClick={() => { setShowReply(false); setReplyText(''); setReplyEmoji('') }} className="px-4 py-2 border rounded-md">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* children replies */}
        {comment.children && comment.children.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.children.map((ch) => (
              <CommentItem key={ch._id} comment={ch} depth={depth + 1} />
            ))}
          </div>
        )}
      </motion.div>
    )
  }

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

  const getShareUrl = () => {
    // Prefer explicit frontend origin from env so shares use your production domain
    const envOrigin = import.meta.env.VITE_FRONTEND_URL || import.meta.env.VITE_SITE_URL
    // Fallback to window.location.origin when env is not configured
    const origin = envOrigin ? String(envOrigin).replace(/\/+$/, '') : window.location?.origin || ''
    if (post && post._id) {
      return `${origin}/post/${post._id}`
    }
    // final fallback
    return window.location.href
  }

  const getShareText = () => {
    return `${post.title} - Check out this amazing article!`
  }

  const handleShare = async (platform) => {
    const url = getShareUrl()
    const text = getShareText()
    
    // Try native Web Share API first (works best on mobile)
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: text,
          url: url,
        })
        toast.success('Shared successfully!')
        setShowShareMenu(false)
        return
      } catch (err) {
        console.log('Share cancelled or failed')
        return
      }
    }
    
    let shareUrl = ''
    
    switch(platform) {
      case 'twitter':
        // Twitter automatically handles URL linkification
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'whatsapp':
        // WhatsApp: Put URL at the end with space before it for better linkification
        const whatsappMessage = `${text} ${url}`
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'copy':
        // Copy URL only - apps will auto-detect and linkify it
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
        setShowShareMenu(false)
        return
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=600')
    setShowShareMenu(false)
    toast.success(`Sharing on ${platform}!`)
  }

  const submitComment = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }
    try {
      await postComment(comment, null, () => { setComment(''); setShowCommentBox(false); setCommentEmoji('') }, commentEmoji)
    } catch (e) {
      console.error(e)
      toast.error('Failed to post comment. Please login.')
    }
  }

  // Post a comment or reply. If parentId is provided, it's treated as a reply.
  const postComment = async (text, parentId = null, resetCb = null, emoji = '') => {
    if (!text || !text.trim()) {
      toast.error('Comment cannot be empty')
      return
    }
    try {
      await api.post(`/blogs/commentblog/${id}`, { comment: text, parentId, emoji })
      const res = await api.get(`/blogs/getblog/${id}`)
      setPost(res.data?.blog || res.blog)
      if (resetCb) resetCb()
      toast.success('Comment posted!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to post comment. Please login.')
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
      {/* Back Button */}
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

      {/* Cover Image */}
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

      {/* Categories & Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {post.categories?.map((cat, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold"
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

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-6 text-balance"
      >
        {post.title}
      </motion.h1>

      {/* Author Info & Meta */}
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
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views || 0} views
              </span>
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
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

          {/* Delete Button (Author Only) */}
          {isAuthor && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
              title="Delete post"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}

          {/* Share Button with Dropdown */}
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

            {/* Share Dropdown Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="py-2">
                    {/* Native Share (if supported) */}
                    {navigator.share && (
                      <>
                        <button
                          onClick={() => handleShare('native')}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">More Options</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Use device share menu</div>
                          </div>
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      </>
                    )}
                    
                    {/* Twitter */}
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Twitter</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Share on Twitter</div>
                      </div>
                    </button>

                    {/* LinkedIn */}
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">LinkedIn</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Share on LinkedIn</div>
                      </div>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">WhatsApp</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Share on WhatsApp</div>
                      </div>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Facebook</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Share on Facebook</div>
                      </div>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Copy Link</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Copy to clipboard</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
      >
        {/* Render sanitized HTML from the WYSIWYG editor */}
        <div
          className="text-lg leading-relaxed text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
        />
      </motion.div>

      {/* Divider */}
      <div className="my-12 border-t border-gray-200 dark:border-gray-700"></div>

      {/* Comments Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold">
            Comments ({post.comments ? post.comments.length : 0})
          </h3>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowCommentBox(!showCommentBox); if (!showComments) setShowComments(true); }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg"
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

        {/* Comment Input Box */}
        <AnimatePresence>
          {showCommentBox && showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 glass rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition resize-none"
                    />

                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  <div className="relative">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xl">🙂</button>
                    {showEmojiPicker && (
                      <div className="absolute right-0 bottom-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 grid grid-cols-5 gap-2">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => { setComment(prev => prev + e); setCommentEmoji(e); setShowEmojiPicker(false) }} className="px-2 py-1 text-2xl leading-none">{e}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={submitComment}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-semibold"
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

        {/* Comments List */}
        {showComments ? (
          <div className="space-y-6">
            {(!post.comments || post.comments.length === 0) ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              // Render nested comments recursively
              post.comments.map((c, idx) => (
                <CommentItem key={c._id || idx} comment={c} depth={0} />
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

      {/* Related Posts / Back to Home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </motion.div>

      {/* Delete Confirmation Modal */}
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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
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
