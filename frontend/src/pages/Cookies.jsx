// @ts-nocheck
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cookies() {
  const lastUpdated = "January 15, 2024"
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    advertising: false
  })
  const [showBanner, setShowBanner] = useState(false)

  const cookieTypes = [
    {
      name: "Essential Cookies",
      key: "essential",
      required: true,
      icon: "🔐",
      description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.",
      examples: [
        "Session management",
        "Authentication tokens",
        "Security features",
        "Basic site functionality"
      ]
    },
    {
      name: "Functional Cookies",
      key: "functional",
      required: false,
      icon: "⚙️",
      description: "These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or by third party providers whose services we use.",
      examples: [
        "Language preferences",
        "Theme settings (dark/light mode)",
        "Layout customizations",
        "Remember me features"
      ]
    },
    {
      name: "Analytics Cookies",
      key: "analytics",
      required: false,
      icon: "📊",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service and user experience.",
      examples: [
        "Page views and navigation paths",
        "Time spent on pages",
        "Device and browser information",
        "Traffic sources and demographics"
      ]
    },
    {
      name: "Advertising Cookies",
      key: "advertising",
      required: false,
      icon: "📢",
      description: "These cookies may be set through our site by advertising partners to build a profile of your interests and show you relevant ads on other sites. They don't store personal information directly but are based on uniquely identifying your browser and device.",
      examples: [
        "Targeted advertising",
        "Ad performance tracking",
        "Retargeting campaigns",
        "Social media advertising"
      ]
    }
  ]

  const handleToggle = (key) => {
    if (key !== 'essential') {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  const handleSavePreferences = () => {
    console.log('Cookie preferences saved:', preferences)
    setShowBanner(true)
    setTimeout(() => setShowBanner(false), 3000)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            How we use cookies to enhance your experience
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <span className="text-5xl">🍪</span>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                What Are Cookies?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Cookies are small text files stored on your device when you visit websites. They help websites remember 
                your preferences, understand how you use the site, and provide a personalized experience.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                We use different types of cookies for various purposes. You have control over which cookies you allow, 
                except for essential cookies which are necessary for the site to function properly.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cookie Types & Controls */}
        <div className="space-y-6 mb-12">
          {cookieTypes.map((cookie, index) => (
            <motion.div
              key={cookie.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-4xl">{cookie.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {cookie.name}
                      </h3>
                      {cookie.required && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                          REQUIRED
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {cookie.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Examples:</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {cookie.examples.map((example, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(cookie.key)}
                  disabled={cookie.required}
                  className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    preferences[cookie.key]
                      ? 'bg-orange-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  } ${cookie.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      preferences[cookie.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Save Preferences Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-12"
        >
          <button
            onClick={handleSavePreferences}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Save Cookie Preferences
          </button>
        </motion.div>

        {/* Success Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
            >
              <span>✓</span>
              <span className="font-semibold">Cookie preferences saved!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Third-Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🔗 Third-Party Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Some cookies on our site are set by third-party services we use:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">→</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Google Analytics:</strong>
                <span className="text-gray-700 dark:text-gray-300"> Helps us understand site traffic and usage patterns</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">→</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Social Media Platforms:</strong>
                <span className="text-gray-700 dark:text-gray-300"> Enable sharing features and social login</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">→</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Payment Processors:</strong>
                <span className="text-gray-700 dark:text-gray-300"> Secure payment handling for premium features</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🛠️ Managing Cookies in Your Browser
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You can also control cookies through your browser settings:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <strong className="text-gray-900 dark:text-white block mb-2">Chrome</strong>
              <span className="text-sm text-gray-600 dark:text-gray-400">Settings → Privacy & Security → Cookies</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <strong className="text-gray-900 dark:text-white block mb-2">Firefox</strong>
              <span className="text-sm text-gray-600 dark:text-gray-400">Settings → Privacy & Security → Cookies</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <strong className="text-gray-900 dark:text-white block mb-2">Safari</strong>
              <span className="text-sm text-gray-600 dark:text-gray-400">Preferences → Privacy → Cookies</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <strong className="text-gray-900 dark:text-white block mb-2">Edge</strong>
              <span className="text-sm text-gray-600 dark:text-gray-400">Settings → Privacy → Cookies</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Note: Blocking certain cookies may affect site functionality and your user experience.
          </p>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions about our use of cookies?
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="inline-block px-8 py-3 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border-2 border-orange-600 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
