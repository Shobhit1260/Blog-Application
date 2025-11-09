// @ts-nocheck
import React from 'react'
import { motion } from 'framer-motion'

export default function Privacy() {
  const lastUpdated = "January 15, 2024"

  const sections = [
    {
      title: "1. Information We Collect",
      icon: "📋",
      content: "We collect information you provide directly to us, including your name, email address, username, password, profile information, and any content you create or share. We also automatically collect certain information about your device and how you interact with our service, including IP address, browser type, operating system, and usage patterns."
    },
    {
      title: "2. How We Use Your Information",
      icon: "⚙️",
      content: "We use the information we collect to: provide, maintain, and improve our services; process your transactions; send you technical notices and support messages; respond to your comments and questions; communicate with you about products, services, and events; monitor and analyze trends and usage; detect and prevent fraud and abuse; and personalize your experience."
    },
    {
      title: "3. Information Sharing",
      icon: "🔗",
      content: "We do not sell your personal information. We may share your information with: other users (your public profile and posts); service providers who assist us in operating our platform; law enforcement or government officials when required by law; other parties in connection with a merger, acquisition, or sale of assets; and with your consent or at your direction."
    },
    {
      title: "4. Cookies and Tracking",
      icon: "🍪",
      content: "We use cookies and similar tracking technologies to collect information about your browsing activities. This helps us remember your preferences, understand how you use our service, and improve your experience. You can control cookies through your browser settings, but disabling cookies may limit some features of our service."
    },
    {
      title: "5. Data Security",
      icon: "🔒",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security. We encourage you to use strong passwords and keep your account credentials confidential."
    },
    {
      title: "6. Your Rights and Choices",
      icon: "⚖️",
      content: "You have the right to: access, update, or delete your personal information; opt-out of marketing communications; request a copy of your data; restrict or object to processing of your data; and withdraw consent where we rely on it. You can exercise these rights through your account settings or by contacting us directly."
    },
    {
      title: "7. Data Retention",
      icon: "📦",
      content: "We retain your information for as long as your account is active or as needed to provide you services. We may retain certain information after account deletion for legal, regulatory, or legitimate business purposes, including fraud prevention and compliance with our legal obligations."
    },
    {
      title: "8. Children's Privacy",
      icon: "👶",
      content: "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will take steps to delete it promptly. If you believe we have collected information from a child under 13, please contact us immediately."
    },
    {
      title: "9. International Data Transfers",
      icon: "🌍",
      content: "Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your information internationally, we take appropriate safeguards to ensure your information remains protected."
    },
    {
      title: "10. Third-Party Services",
      icon: "🔌",
      content: "Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information to them."
    },
    {
      title: "11. Changes to This Policy",
      icon: "📝",
      content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date. We encourage you to review this policy periodically. Your continued use of our service after changes constitutes acceptance of the updated policy."
    },
    {
      title: "12. Contact Us",
      icon: "📧",
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: privacy@blogger.com, or through our contact page. You can also write to us at: Blogger Privacy Team, 123 Writing Street, San Francisco, CA 94102, United States."
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔐</div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Your Privacy Matters
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                At Blogger, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our blogging platform. We are committed to protecting your 
                personal data and being transparent about our practices.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{section.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GDPR Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl"
        >
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
            🇪🇺 GDPR Compliance
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If you are located in the European Economic Area (EEA), you have additional rights under the General Data 
            Protection Regulation (GDPR), including the right to data portability, the right to be forgotten, and the 
            right to lodge a complaint with a supervisory authority.
          </p>
        </motion.div>

        {/* California Privacy Rights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-xl"
        >
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">
            🌟 California Privacy Rights (CCPA)
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            California residents have specific privacy rights under the California Consumer Privacy Act (CCPA), including 
            the right to know what personal information is collected, the right to delete personal information, and the 
            right to opt-out of the sale of personal information. We do not sell your personal information.
          </p>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have privacy concerns or questions?
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Contact Us
            </a>
            <a
              href="/cookies"
              className="inline-block px-8 py-3 bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 border-2 border-cyan-600 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
