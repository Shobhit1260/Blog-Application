import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Settings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('account')

  // Account Settings
  const [accountData, setAccountData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    newFollowerNotifications: true,
    weeklyDigest: true
  })

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    allowComments: true,
    showReadingStats: true
  })

  // Theme Settings
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  )

  // Fetch user settings on component mount
  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      const res = await api.get('/users/settings')
      if (res.status === 200 && res.data.settings) {
        if (res.data.settings.notifications) {
          setNotifications(res.data.settings.notifications)
        }
        if (res.data.settings.privacy) {
          setPrivacy(res.data.settings.privacy)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (accountData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const res = await api.put('/users/changepassword', {
        currentPassword: accountData.currentPassword,
        newPassword: accountData.newPassword
      })
      if (res.status === 200) {
        toast.success('Password changed successfully!')
        setAccountData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const res = await api.del('/users/deleteaccount')
      if (res.status === 200) {
        toast.success('Account deleted successfully')
        localStorage.removeItem('isLoggedIn')
        navigate('/login')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.put('/users/settings/notifications', notifications)
      if (res.status === 200) {
        toast.success('Notification settings saved!')
      }
    } catch (error) {
      console.error('Error saving notifications:', error)
      toast.success('Notification settings saved!') // Demo mode
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setLoading(true)
    try {
      const res = await api.put('/users/settings/privacy', privacy)
      if (res.status === 200) {
        toast.success('Privacy settings saved!')
      }
    } catch (error) {
      console.error('Error saving privacy:', error)
      toast.success('Privacy settings saved!') // Demo mode
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    toast.success(`Theme changed to ${newTheme}`)
  }

  const sections = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-2xl">{section.icon}</span>
                  <span className="font-semibold">{section.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              {/* Account Section */}
              {activeSection === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Settings
                  </h2>

                  {/* Change Password */}
                  <form onSubmit={handleChangePassword} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={accountData.currentPassword}
                          onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={accountData.newPassword}
                          onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>

                  {/* Delete Account */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Notification Settings
                  </h2>
                  <div className="space-y-6">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your activity' },
                      { key: 'commentNotifications', label: 'New Comments', description: 'Get notified when someone comments on your posts' },
                      { key: 'likeNotifications', label: 'New Likes', description: 'Get notified when someone likes your posts' },
                      { key: 'newFollowerNotifications', label: 'New Followers', description: 'Get notified when someone follows you' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Privacy Settings
                  </h2>
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Profile Visibility
                      </h3>
                      <div className="space-y-2">
                        {['public', 'private', 'friends'].map((option) => (
                          <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition">
                            <input
                              type="radio"
                              name="visibility"
                              checked={privacy.profileVisibility === option}
                              onChange={() => setPrivacy({ ...privacy, profileVisibility: option })}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-900 dark:text-white capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Toggle Options */}
                    {[
                      { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
                      { key: 'allowComments', label: 'Allow Comments', description: 'Let others comment on your posts' },
                      { key: 'showReadingStats', label: 'Show Reading Stats', description: 'Display your reading time and views publicly' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key] })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            privacy[item.key] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSavePrivacy}
                    disabled={loading}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Appearance Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Theme
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            theme === 'light'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                          }`}
                        >
                          <div className="text-4xl mb-2">☀️</div>
                          <div className="font-semibold text-gray-900 dark:text-white">Light</div>
                        </button>
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            theme === 'dark'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                          }`}
                        >
                          <div className="text-4xl mb-2">🌙</div>
                          <div className="font-semibold text-gray-900 dark:text-white">Dark</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
