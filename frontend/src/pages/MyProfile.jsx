import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import { Navigate, useNavigate } from 'react-router-dom'
import { selectUser } from '../store/store'
import { updateUser } from '../store/userSlice'
import { Link } from 'react-router-dom'

export default function MyProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reduxUser = useSelector(selectUser)
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    bgImage:'',
    location: '',
    website: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [bgFile, setBgFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [bgPreview, setBgPreview] = useState('')
  const [posts, setPosts] = useState([])

  // Create object URL previews for selected files and clean up
  useEffect(() => {
    let avUrl
    if (avatarFile) {
      avUrl = URL.createObjectURL(avatarFile)
      setAvatarPreview(avUrl)
    } else {
      setAvatarPreview('')
    }
    return () => {
      if (avUrl) URL.revokeObjectURL(avUrl)
    }
  }, [avatarFile])

  useEffect(() => {
    let bgUrl
    if (bgFile) {
      bgUrl = URL.createObjectURL(bgFile)
      setBgPreview(bgUrl)
    } else {
      setBgPreview('')
    }
    return () => {
      if (bgUrl) URL.revokeObjectURL(bgUrl)
    }
  }, [bgFile])

  useEffect(() => {
    fetchProfile()
    fetchMyPosts()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me')
      if (res.status === 200) {
        setUser(res.data.user)
        setFormData({
          username: res.data.user.username || '',
          email: res.data.user.email || '',
          bio: res.data.user.bio || '',
          avatar: res.data.user.avatar || '',
          location: res.data.user.location || '',
          website: res.data.user.website || '',
          bgImage: res.data.user.bgImage || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPosts = async () => {
    try {
      const res = await api.get('/blogs/myposts')
      if (res.status === 200) {
        setPosts(res.data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching my posts:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // If the user selected files, send multipart/form-data
      let res
      if (avatarFile || bgFile) {
        const data = new FormData()
        data.append('username', formData.username)
        data.append('email', formData.email)
        data.append('bio', formData.bio)
        data.append('location', formData.location)
        data.append('website', formData.website)
        // Append files if present. Backend multer expects fields named 'avatar' and 'bgImage'
        if (avatarFile) data.append('avatar', avatarFile)
        if (bgFile) data.append('bgImage', bgFile)

        res = await api.put('/users/updateprofile', data)
      } else {
        res = await api.put('/users/updateprofile', formData)
      }
      if (res.status === 200) {
        const updatedUserData = res.data.user || formData
        console.log('Updated user data:', updatedUserData)
        
        // Update local state
        const updatedUser = { ...user, ...updatedUserData }
        setUser(updatedUser)
        
        // Update Redux store and localStorage with the complete updated user
        dispatch(updateUser(updatedUserData))
        
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {formData.bgImage && (
              <img
                src={formData.bgImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {isEditing && (
              <button
                type="button"
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Change cover image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>

          <div className="px-8 pb-8">
            {/* Avatar */}
              <div className="relative -mt-16 mb-6">
              <img
                src={
                  avatarPreview || formData.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200'
                }
                alt={formData.username}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.postsCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.followersCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.followingCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
              </div>
            </div>

            {/* Recent posts (preview) */}
            {posts && posts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {posts.slice(0, 3).map((p) => (
                    <Link to={`/post/${p._id}`} key={p._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition">
                      <div className="text-sm text-gray-500 mb-1">{new Date(p.createdAt).toLocaleDateString()}</div>
                      <div className="font-semibold text-gray-900 dark:text-white line-clamp-2">{p.title}</div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/my-posts" className="text-sm text-indigo-600 hover:underline">View all my posts</Link>
                </div>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition"
                    placeholder="City, Country"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                
                {/* Avatar & Background Image URLs (shown only when editing) */}
            
                  
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Profile picture URL (recommended: 200x200px)
                      </p>
                      {/* File upload */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Avatar</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0]
                            setAvatarFile(file || null)
                            // If user selects a file, clear the avatar URL so preview comes from file
                            if (file) setFormData({ ...formData, avatar: '' })
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.bgImage}
                        onChange={(e) => setFormData({ ...formData, bgImage: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="https://example.com/cover.jpg"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Cover image URL (recommended: 1200x300px or larger)
                      </p>
                      {/* File upload for background */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Background Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0]
                            setBgFile(file || null)
                            if (file) setFormData({ ...formData, bgImage: '' })
                          }}
                          className="w-full"
                        />
                      </div>
                      {/* Preview */}
                      { (bgPreview || formData.bgImage) && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                          <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                            <img
                              src={bgPreview || formData.bgImage}
                              alt="Background preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
               
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/')
                        setFormData({
                          username: user.username || '',
                          email: user.email || '',
                          bio: user.bio || '',
                          avatar: user.avatar || '',
                          bgImage: user.bgImage || '',
                          location: user.location || '',
                          website: user.website || ''
                        })
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                     {loading ? 'Cancel' : 'Home'}
                    </button>
                
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
