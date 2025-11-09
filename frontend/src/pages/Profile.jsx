import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Profile(){
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector(selectUser)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(()=>{
    fetchProfile()
  },[id])

  const fetchProfile = async ()=>{
    setLoading(true)
    try{
      // If id is current user id, redirect to own profile page
      if (currentUser && currentUser._id && id === currentUser._id) {
        navigate('/profile')
        return
      }

      const res = await api.get(`/users/${id}`)
      if(res.status === 200){
        setProfile(res.data.user)
        setIsFollowing(res.data.user.isFollowing || false)
      }

      // Fetch user's posts
      const blogsRes = await api.get('/blogs/getblogs')
      if(blogsRes.status === 200){
        const userPosts = (blogsRes.data.blogs || []).filter(post => post.author?._id === id)
        setPosts(userPosts)
      }
    }
    catch(err){
      console.error('Failed to load profile', err)
      toast.error('Failed to load profile')
    }
    finally{ setLoading(false) }
  }

  const handleFollow = async () => {
    if(!currentUser) return navigate('/login')
    setProcessing(true)
    try{
      const res = await api.post(`/users/follow/${id}`)
      if(res.status === 200){
        setProfile(prev => prev ? { ...prev, followersCount: res.data.followersCount } : null)
        setIsFollowing(true)
        toast.success('Followed successfully! 🎉')
      }
    }catch(err){
      console.error(err)
      const errorMsg = err?.data?.message || 'Failed to follow'
      toast.error(errorMsg)
    }finally{ setProcessing(false) }
  }

  const handleUnfollow = async () => {
    if(!currentUser) return navigate('/login')
    setProcessing(true)
    try{
      const res = await api.post(`/users/unfollow/${id}`)
      if(res.status === 200){
        setProfile(prev => prev ? { ...prev, followersCount: res.data.followersCount } : null)
        setIsFollowing(false)
        toast.success('Unfollowed')
      }
    }catch(err){
      console.error(err)
      const errorMsg = err?.data?.message || 'Failed to unfollow'
      toast.error(errorMsg)
    }finally{ setProcessing(false) }
  }

  if(loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  )

  if(!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
        <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">Go Home</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Cover Image */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            {profile.bgImage && (
              <img src={profile.bgImage} alt="cover" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-6 md:px-8 pb-8">
            {/* Avatar & Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-20">
              <img 
                src={profile.avatar} 
                alt={profile.username} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" 
              />
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{profile.bio}</p>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {profile.website}
                  </a>
                )}
              </div>

              {/* Follow/Unfollow Button */}
              <div className="md:ml-auto">
                {currentUser && currentUser._id ? (
                  currentUser._id !== id ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                      disabled={processing}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                        isFollowing
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {processing ? 'Processing...' : isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  ) : (
                    <button
                      onClick={() => navigate('/profile')}
                      className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      Edit Profile
                    </button>
                  )
                ) : (
                  <button 
                    onClick={() => navigate('/login')} 
                    className="px-6 py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Login to follow
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {posts.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.followersCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.followingCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User's Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Posts by {profile.username}
          </h2>
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <motion.article
                  key={post._id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <Link to={`/post/${post._id}`}>
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <svg className="w-12 h-12 text-indigo-300 dark:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </Link>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.content?.slice(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
